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
  TimePicker,
  InputNumber,
  message,
  Descriptions,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { visitApi, elderApi } from '../api';
import dayjs from 'dayjs';

const VisitManagement = () => {
  const [visitRecords, setVisitRecords] = useState([]);
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [visitsRes, eldersRes] = await Promise.all([
        visitApi.getAll(),
        elderApi.getActive(),
      ]);
      setVisitRecords(visitsRes.data);
      setElders(eldersRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      visitDate: record.visitDate ? dayjs(record.visitDate) : null,
      scheduledStartTime: record.scheduledStartTime ? dayjs(record.scheduledStartTime, 'HH:mm:ss') : null,
      scheduledEndTime: record.scheduledEndTime ? dayjs(record.scheduledEndTime, 'HH:mm:ss') : null,
    });
    setModalVisible(true);
  };

  const handleDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const handleCheckIn = async (record) => {
    try {
      await visitApi.checkIn(record.id);
      message.success('签到成功');
      loadData();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const handleCheckOut = async (record) => {
    Modal.confirm({
      title: '探访结束',
      content: '确认结束探访？',
      onOk: async () => {
        try {
          await visitApi.checkOut(record.id, '');
          message.success('签退成功');
          loadData();
        } catch (error) {
          message.error('操作失败');
          console.error(error);
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        visitDate: values.visitDate ? values.visitDate.format('YYYY-MM-DD') : null,
        scheduledStartTime: values.scheduledStartTime ? values.scheduledStartTime.format('HH:mm:ss') : null,
        scheduledEndTime: values.scheduledEndTime ? values.scheduledEndTime.format('HH:mm:ss') : null,
      };

      if (editingRecord) {
        // 编辑功能这里暂不实现，因为探访记录一般不编辑
      } else {
        await visitApi.create(data);
        message.success('预约成功');
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusTag = (status) => {
    const colorMap = {
      PENDING: 'orange',
      IN_PROGRESS: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'red',
    };
    const textMap = {
      PENDING: '待探访',
      IN_PROGRESS: '探访中',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
    };
    return <Tag color={colorMap[status] || 'default'}>{textMap[status] || status}</Tag>;
  };

  const columns = [
    {
      title: '老人姓名',
      dataIndex: 'elderName',
      key: 'elderName',
    },
    {
      title: '探访人',
      dataIndex: 'visitorName',
      key: 'visitorName',
    },
    {
      title: '关系',
      dataIndex: 'relationship',
      key: 'relationship',
    },
    {
      title: '探访日期',
      dataIndex: 'visitDate',
      key: 'visitDate',
    },
    {
      title: '预定时间',
      key: 'scheduledTime',
      render: (_, record) => (
        <span>
          {record.scheduledStartTime} - {record.scheduledEndTime}
        </span>
      ),
    },
    {
      title: '探访人数',
      dataIndex: 'visitorCount',
      key: 'visitorCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '实际签到',
      dataIndex: 'actualCheckInTime',
      key: 'actualCheckInTime',
      render: (time) => time ? time : '-',
    },
    {
      title: '实际签退',
      dataIndex: 'actualCheckOutTime',
      key: 'actualCheckOutTime',
      render: (time) => time ? time : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
          {record.status === 'PENDING' && (
            <Button type="link" onClick={() => handleCheckIn(record)}>
            签到
          </Button>
          )}
          {record.status === 'IN_PROGRESS' && (
            <Button type="link" onClick={() => handleCheckOut(record)}>
            签退
          </Button>
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
        title="探访管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            预约探访
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={visitRecords}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title="预约探访"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
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

          <Form.Item
            name="visitorName"
            label="探访人姓名"
            rules={[{ required: true, message: '请输入探访人姓名' }]}
          >
            <Input placeholder="请输入探访人姓名" />
          </Form.Item>

          <Form.Item
            name="visitorPhone"
            label="探访人电话"
            rules={[{ required: true, message: '请输入探访人电话' }]}
          >
            <Input placeholder="请输入探访人电话" />
          </Form.Item>

          <Form.Item
            name="relationship"
            label="关系"
            rules={[{ required: true, message: '请选择关系' }]}
          >
            <Select placeholder="请选择关系">
              <Select.Option value="配偶">配偶</Select.Option>
              <Select.Option value="儿子">儿子</Select.Option>
              <Select.Option value="女儿">女儿</Select.Option>
              <Select.Option value="孙子">孙子</Select.Option>
              <Select.Option value="孙女">孙女</Select.Option>
              <Select.Option value="其他亲属">其他亲属</Select.Option>
              <Select.Option value="朋友">朋友</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="visitorCount"
            label="探访人数"
            rules={[{ required: true, message: '请输入探访人数' }]}
          >
            <InputNumber
              placeholder="请输入探访人数"
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="visitDate"
            label="探访日期"
            rules={[{ required: true, message: '请选择探访日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="scheduledStartTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="scheduledEndTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>

          <Form.Item name="note" label="备注">
            <Input.TextArea placeholder="请输入备注" rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="探访详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="老人姓名">{selectedRecord.elderName}</Descriptions.Item>
            <Descriptions.Item label="探访人">{selectedRecord.visitorName}</Descriptions.Item>
            <Descriptions.Item label="探访人电话">{selectedRecord.visitorPhone}</Descriptions.Item>
            <Descriptions.Item label="关系">{selectedRecord.relationship}</Descriptions.Item>
            <Descriptions.Item label="探访人数">{selectedRecord.visitorCount}</Descriptions.Item>
            <Descriptions.Item label="探访日期">{selectedRecord.visitDate}</Descriptions.Item>
            <Descriptions.Item label="预定时间">
              {selectedRecord.scheduledStartTime} - {selectedRecord.scheduledEndTime}
            </Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedRecord.status)}</Descriptions.Item>
            {selectedRecord.actualCheckInTime && (
              <Descriptions.Item label="实际签到时间">{selectedRecord.actualCheckInTime}</Descriptions.Item>
            )}
            {selectedRecord.actualCheckOutTime && (
              <Descriptions.Item label="实际签退时间">{selectedRecord.actualCheckOutTime}</Descriptions.Item>
            )}
            {selectedRecord.note && (
              <Descriptions.Item label="备注">{selectedRecord.note}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default VisitManagement;
