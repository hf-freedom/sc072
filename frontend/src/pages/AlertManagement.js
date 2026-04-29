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
  message,
  Descriptions,
  Badge,
} from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { alertApi, commonApi } from '../api';

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [handleVisible, setHandleVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsRes, nursesRes] = await Promise.all([
        alertApi.getAll(),
        commonApi.getNurses(),
      ]);
      setAlerts(alertsRes.data);
      setNurses(nursesRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (record) => {
    setSelectedAlert(record);
    setDetailVisible(true);
  };

  const showHandleModal = (record) => {
    setSelectedAlert(record);
    form.resetFields();
    setHandleVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await alertApi.handle(selectedAlert.id, values.handledBy, values.handleNote);
      message.success('处理成功');
      setHandleVisible(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const getTypeText = (type) => {
    const typeMap = {
      TASK_DELAY: '任务延迟',
      FINANCIAL_OVERDUE: '费用逾期',
      HEALTH_ABNORMAL: '健康异常',
    };
    return typeMap[type] || type;
  };

  const getLevelColor = (level) => {
    const colorMap = {
      CRITICAL: 'red',
      WARNING: 'orange',
      INFO: 'blue',
    };
    return colorMap[level] || 'default';
  };

  const getStatusTag = (status) => {
    const colorMap = {
      ACTIVE: 'red',
      HANDLED: 'green',
    };
    const textMap = {
      ACTIVE: '待处理',
      HANDLED: '已处理',
    };
    return <Tag color={colorMap[status] || 'default'}>{textMap[status] || status}</Tag>;
  };

  const columns = [
    {
      title: '告警类型',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type) => getTypeText(type),
    },
    {
      title: '告警级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      render: (level) => <Tag color={getLevelColor(level)}>{level}</Tag>,
    },
    {
      title: '老人姓名',
      dataIndex: 'elderName',
      key: 'elderName',
      render: (name) => name || '-',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '处理人',
      dataIndex: 'handledBy',
      key: 'handledBy',
      render: (name) => name || '-',
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime',
      key: 'handleTime',
      render: (time) => time || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
          {record.status === 'ACTIVE' && (
            <Button type="link" icon={<CheckOutlined />} onClick={() => showHandleModal(record)}>
            处理
          </Button>
          )}
        </Space>
      ),
    },
  ];

  const nurseOptions = nurses.map(nurse => ({
    value: nurse.name,
    label: nurse.name,
  }));

  return (
    <div>
      <Card title="异常告警管理">
        <Table
          columns={columns}
          dataSource={alerts}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title="告警详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {selectedAlert && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="告警类型">{getTypeText(selectedAlert.alertType)}</Descriptions.Item>
            <Descriptions.Item label="告警级别">
              <Tag color={getLevelColor(selectedAlert.alertLevel)}>{selectedAlert.alertLevel}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="老人姓名">{selectedAlert.elderName || '-'}</Descriptions.Item>
            <Descriptions.Item label="标题">{selectedAlert.title}</Descriptions.Item>
            <Descriptions.Item label="描述">{selectedAlert.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedAlert.status)}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedAlert.createTime}</Descriptions.Item>
            {selectedAlert.handledBy && (
              <Descriptions.Item label="处理人">{selectedAlert.handledBy}</Descriptions.Item>
            )}
            {selectedAlert.handleTime && (
              <Descriptions.Item label="处理时间">{selectedAlert.handleTime}</Descriptions.Item>
            )}
            {selectedAlert.handleNote && (
              <Descriptions.Item label="处理备注">{selectedAlert.handleNote}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="处理告警"
        open={handleVisible}
        onOk={handleSubmit}
        onCancel={() => setHandleVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="handledBy"
            label="处理人"
            rules={[{ required: true, message: '请输入处理人' }]}
          >
            <Select placeholder="请选择或输入处理人" allowClear options={nurseOptions} />
          </Form.Item>
          <Form.Item
            name="handleNote"
            label="处理备注"
            rules={[{ required: true, message: '请输入处理备注' }]}
          >
            <Input.TextArea placeholder="请输入处理备注" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertManagement;
