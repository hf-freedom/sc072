import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  DatePicker,
  Modal,
  Form,
  Input,
  Select,
  message,
  Badge,
  Descriptions,
} from 'antd';
import {
  CheckCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { carePlanApi, elderApi, commonApi } from '../api';
import dayjs from 'dayjs';

const CareTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [elders, setElders] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, eldersRes, nursesRes] = await Promise.all([
        carePlanApi.getTasksByDate(selectedDate.format('YYYY-MM-DD')),
        elderApi.getActive(),
        commonApi.getOnDutyNurses(),
      ]);
      setTasks(tasksRes.data);
      setElders(eldersRes.data);
      setNurses(nursesRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showDetail = (record) => {
    setSelectedTask(record);
    setDetailVisible(true);
  };

  const showCompleteModal = (record) => {
    setSelectedTask(record);
    form.resetFields();
    setCompleteModalVisible(true);
  };

  const handleComplete = async () => {
    try {
      const values = await form.validateFields();
      await carePlanApi.completeTask(selectedTask.id, values);
      message.success('任务完成');
      setCompleteModalVisible(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePause = async (record) => {
    try {
      await carePlanApi.pauseTask(record.id);
      message.success('任务已暂停');
      loadData();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const handleResume = async (record) => {
    try {
      await carePlanApi.resumeTask(record.id);
      message.success('任务已恢复');
      loadData();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const getStatusTag = (status, record) => {
    if (record.isPaused) {
      return <Tag color="default">已暂停</Tag>;
    }
    const colorMap = {
      PENDING: 'orange',
      COMPLETED: 'green',
      PAUSED: 'default',
      CANCELLED: 'red',
    };
    const textMap = {
      PENDING: '待执行',
      COMPLETED: '已完成',
      PAUSED: '已暂停',
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
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '预定时间',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => getStatusTag(status, record),
    },
    {
      title: '执行护士',
      dataIndex: 'nurseName',
      key: 'nurseName',
      render: (name) => name || '-',
    },
    {
      title: '执行时间',
      dataIndex: 'executeTime',
      key: 'executeTime',
      render: (time) => time ? time : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showDetail(record)}>
            详情
          </Button>
          {record.status === 'PENDING' && !record.isPaused && (
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => showCompleteModal(record)}>
              完成
            </Button>
          )}
          {record.status === 'PENDING' && !record.isPaused && (
            <Button type="link" icon={<PauseCircleOutlined />} onClick={() => handlePause(record)}>
              暂停
            </Button>
          )}
          {record.isPaused && (
            <Button type="link" icon={<PlayCircleOutlined />} onClick={() => handleResume(record)}>
              恢复
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const nurseOptions = nurses.map(nurse => ({
    value: nurse.id?.toString(),
    label: nurse.name,
  }));

  return (
    <div>
      <Card
        title="护理任务管理"
        extra={
          <Space>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              style={{ width: 200 }}
            />
            <Button onClick={loadData}>刷新</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title="任务详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {selectedTask && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="老人姓名">{selectedTask.elderName}</Descriptions.Item>
            <Descriptions.Item label="任务名称">{selectedTask.taskName}</Descriptions.Item>
            <Descriptions.Item label="任务描述">{selectedTask.taskDescription || '-'}</Descriptions.Item>
            <Descriptions.Item label="任务日期">{selectedTask.taskDate}</Descriptions.Item>
            <Descriptions.Item label="预定时间">{selectedTask.scheduledTime}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStatusTag(selectedTask.status, selectedTask)}
            </Descriptions.Item>
            {selectedTask.nurseName && (
              <Descriptions.Item label="执行护士">{selectedTask.nurseName}</Descriptions.Item>
            )}
            {selectedTask.executeTime && (
              <Descriptions.Item label="执行时间">{selectedTask.executeTime}</Descriptions.Item>
            )}
            {selectedTask.executeResult && (
              <Descriptions.Item label="执行结果">{selectedTask.executeResult}</Descriptions.Item>
            )}
            {selectedTask.executeNote && (
              <Descriptions.Item label="执行备注">{selectedTask.executeNote}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="完成任务"
        open={completeModalVisible}
        onOk={handleComplete}
        onCancel={() => setCompleteModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nurseId"
            label="执行护士"
            rules={[{ required: true, message: '请选择执行护士' }]}
          >
            <Select placeholder="请选择执行护士" options={nurseOptions} />
          </Form.Item>
          <Form.Item
            name="nurseName"
            label="护士姓名"
            rules={[{ required: true, message: '请输入护士姓名' }]}
          >
            <Input placeholder="请输入护士姓名" />
          </Form.Item>
          <Form.Item
            name="result"
            label="执行结果"
            rules={[{ required: true, message: '请输入执行结果' }]}
          >
            <Select placeholder="请选择执行结果">
              <Select.Option value="正常完成">正常完成</Select.Option>
              <Select.Option value="部分完成">部分完成</Select.Option>
              <Select.Option value="老人拒绝">老人拒绝</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="备注">
            <Input.TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CareTaskManagement;
