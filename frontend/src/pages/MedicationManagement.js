import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  TimePicker,
  message,
  Descriptions,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { medicationApi, elderApi } from '../api';
import dayjs from 'dayjs';

const MedicationManagement = () => {
  const [medicationPlans, setMedicationPlans] = useState([]);
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, eldersRes] = await Promise.all([
        medicationApi.getAll(),
        elderApi.getActive(),
      ]);
      setMedicationPlans(plansRes.data);
      setElders(eldersRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPlan(null);
    form.resetFields();
    setItems([]);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingPlan(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setItems(record.items || []);
    setModalVisible(true);
  };

  const handleDetail = (record) => {
    setSelectedPlan(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await medicationApi.delete(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        items: items.map((item, index) => ({
          ...item,
          id: index + 1,
          scheduledTime: item.scheduledTime ? item.scheduledTime.format('HH:mm:ss') : null,
        })),
      };

      if (editingPlan) {
        await medicationApi.update(editingPlan.id, data);
        message.success('更新成功');
      } else {
        await medicationApi.create(data);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const addMedicationItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        medicationName: '',
        dosage: '',
        unit: 'mg',
        frequency: '每日一次',
        route: '口服',
        status: 'ACTIVE',
        price: 0,
      },
    ]);
  };

  const updateMedicationItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeMedicationItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const columns = [
    {
      title: '老人姓名',
      dataIndex: 'elderName',
      key: 'elderName',
    },
    {
      title: '诊断',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: '医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '药品数量',
      key: 'itemCount',
      render: (_, record) => record.items?.length || 0,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? '生效中' : '已停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status === 'ACTIVE' && (
            <Popconfirm
              title="确定删除该用药计划吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const elderOptions = elders.map(elder => ({
    value: elder.id,
    label: elder.name,
  }));

  return (
    <div>
      <Card
        title="用药计划管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用药计划
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={medicationPlans}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingPlan ? '编辑用药计划' : '添加用药计划'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={900}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="elderId"
            label="选择老人"
            rules={[{ required: true, message: '请选择老人' }]}
          >
            <Select
              placeholder="请选择老人"
              options={elderOptions}
              onChange={(value, option) => {
                form.setFieldsValue({ elderName: option.label });
              }}
            />
          </Form.Item>

          <Form.Item name="elderName" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="doctorName" label="医生">
            <Input placeholder="请输入医生姓名" />
          </Form.Item>

          <Form.Item name="diagnosis" label="诊断">
            <Input.TextArea placeholder="请输入诊断" rows={2} />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="endDate" label="结束日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong>药品列表</strong>
            <Button type="dashed" onClick={addMedicationItem}>
              + 添加药品
            </Button>
          </div>

          {items.map((item, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 8 }}
              extra={
                <Button type="link" danger onClick={() => removeMedicationItem(index)}>
                  删除
                </Button>
              }
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                <Input
                  placeholder="药品名称"
                  value={item.medicationName}
                  onChange={(e) => updateMedicationItem(index, 'medicationName', e.target.value)}
                />
                <Input
                  placeholder="剂量"
                  value={item.dosage}
                  onChange={(e) => updateMedicationItem(index, 'dosage', e.target.value)}
                />
                <Select
                  placeholder="单位"
                  value={item.unit}
                  onChange={(v) => updateMedicationItem(index, 'unit', v)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="mg">mg</Select.Option>
                  <Select.Option value="g">g</Select.Option>
                  <Select.Option value="ml">ml</Select.Option>
                  <Select.Option value="片">片</Select.Option>
                  <Select.Option value="粒">粒</Select.Option>
                </Select>
                <TimePicker
                  placeholder="用药时间"
                  value={item.scheduledTime}
                  onChange={(v) => updateMedicationItem(index, 'scheduledTime', v)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
                <Select
                  placeholder="频次"
                  value={item.frequency}
                  onChange={(v) => updateMedicationItem(index, 'frequency', v)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="每日一次">每日一次</Select.Option>
                  <Select.Option value="每日两次">每日两次</Select.Option>
                  <Select.Option value="每日三次">每日三次</Select.Option>
                  <Select.Option value="饭前">饭前</Select.Option>
                  <Select.Option value="饭后">饭后</Select.Option>
                </Select>
                <Select
                  placeholder="给药途径"
                  value={item.route}
                  onChange={(v) => updateMedicationItem(index, 'route', v)}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="口服">口服</Select.Option>
                  <Select.Option value="外用">外用</Select.Option>
                  <Select.Option value="注射">注射</Select.Option>
                </Select>
                <InputNumber
                  placeholder="价格"
                  value={item.price}
                  onChange={(v) => updateMedicationItem(index, 'price', v)}
                  style={{ width: '100%' }}
                  prefix="¥"
                  step={0.01}
                  precision={2}
                />
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      <Modal
        title="用药计划详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPlan && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="老人姓名">{selectedPlan.elderName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedPlan.status === 'ACTIVE' ? 'green' : 'red'}>
                  {selectedPlan.status === 'ACTIVE' ? '生效中' : '已停用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="医生">{selectedPlan.doctorName || '-'}</Descriptions.Item>
              <Descriptions.Item label="诊断">{selectedPlan.diagnosis || '-'}</Descriptions.Item>
              <Descriptions.Item label="开始日期">{selectedPlan.startDate}</Descriptions.Item>
              <Descriptions.Item label="结束日期">{selectedPlan.endDate || '-'}</Descriptions.Item>
            </Descriptions>

            {selectedPlan.items && selectedPlan.items.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4>药品列表</h4>
                <Table
                  columns={[
                    { title: '药品名称', dataIndex: 'medicationName', key: 'medicationName' },
                    { title: '剂量', dataIndex: 'dosage', key: 'dosage' },
                    { title: '单位', dataIndex: 'unit', key: 'unit' },
                    { title: '用药时间', dataIndex: 'scheduledTime', key: 'scheduledTime' },
                    { title: '频次', dataIndex: 'frequency', key: 'frequency' },
                    { title: '给药途径', dataIndex: 'route', key: 'route' },
                    { title: '价格', dataIndex: 'price', key: 'price', render: (p) => `¥${p}` },
                  ]}
                  dataSource={selectedPlan.items}
                  rowKey="id"
                  size="small"
                  pagination={false}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicationManagement;
