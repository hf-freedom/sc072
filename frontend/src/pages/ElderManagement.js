import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  message,
  Popconfirm,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { elderApi, commonApi } from '../api';
import dayjs from 'dayjs';

const ElderManagement = () => {
  const location = useLocation();
  const [elders, setElders] = useState([]);
  const [careLevels, setCareLevels] = useState([]);
  const [healthStatusOptions, setHealthStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingElder, setEditingElder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [location]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eldersRes, careLevelsRes, healthStatusRes] = await Promise.all([
        elderApi.getAll(),
        commonApi.getCareLevels(),
        commonApi.getHealthStatus(),
      ]);
      setElders(eldersRes.data);
      setCareLevels(careLevelsRes.data);
      setHealthStatusOptions(healthStatusRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingElder(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingElder(record);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate ? dayjs(record.birthDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await elderApi.delete(id);
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
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      };

      if (editingElder) {
        await elderApi.update(editingElder.id, data);
        message.success('更新成功');
      } else {
        await elderApi.create(data);
        message.success('添加成功');
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender === '男' ? '男' : '女',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '护理等级',
      dataIndex: 'careLevel',
      key: 'careLevel',
      render: (careLevel) => {
        const level = careLevels.find(l => l.levelCode === careLevel);
        return level ? level.levelName : careLevel;
      },
    },
    {
      title: '健康状态',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space>
          <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
            {status === 'ACTIVE' ? '在住' : status === 'CHECKED_OUT' ? '已退住' : status}
          </Tag>
          {record.isTemporaryLeave && <Tag color="orange">临时外出</Tag>}
        </Space>
      ),
    },
    {
      title: '床位',
      dataIndex: 'bedId',
      key: 'bedId',
      render: (bedId) => bedId || '-',
    },
    {
      title: '入住日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该老人信息吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const careLevelOptions = careLevels.map(level => ({
    value: level.levelCode,
    label: level.levelName,
  }));

  return (
    <div>
      <Card
        title="老人管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加老人
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={elders}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingElder ? '编辑老人信息' : '添加老人'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item name="idCard" label="身份证号">
            <Input placeholder="请输入身份证号" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="birthDate" label="出生日期">
            <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
          </Form.Item>

          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入电话" />
          </Form.Item>

          <Form.Item name="address" label="地址">
            <Input.TextArea placeholder="请输入地址" rows={2} />
          </Form.Item>

          <Form.Item
            name="careLevel"
            label="护理等级"
            rules={[{ required: true, message: '请选择护理等级' }]}
          >
            <Select placeholder="请选择护理等级" options={careLevelOptions} />
          </Form.Item>

          <Form.Item
            name="healthStatus"
            label="健康状态"
            rules={[{ required: true, message: '请选择健康状态' }]}
          >
            <Select placeholder="请选择健康状态">
              {healthStatusOptions.map(status => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ElderManagement;
