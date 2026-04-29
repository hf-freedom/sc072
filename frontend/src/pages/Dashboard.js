import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, message } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  WalletOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { elderApi, roomApi, carePlanApi, alertApi, billApi, visitApi } from '../api';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalElders: 0,
    activeElders: 0,
    availableBeds: 0,
    totalBeds: 0,
    pendingTasks: 0,
    activeAlerts: 0,
    unpaidBills: 0,
    pendingVisits: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [eldersRes, bedsRes, tasksRes, alertsRes, billsRes, visitsRes] = await Promise.all([
        elderApi.getAll(),
        roomApi.getAllBeds(),
        carePlanApi.getAllTasks(),
        alertApi.getActive(),
        billApi.getUnpaid(),
        visitApi.getPending(),
      ]);

      const elders = eldersRes.data;
      const beds = bedsRes.data;
      const tasks = tasksRes.data;
      const alerts = alertsRes.data;
      const bills = billsRes.data;
      const visits = visitsRes.data;

      const activeElders = elders.filter(e => e.status === 'ACTIVE').length;
      const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;
      const pendingTasks = tasks.filter(t => t.status === 'PENDING' && !t.isPaused).length;

      setStats({
        totalElders: elders.length,
        activeElders,
        availableBeds,
        totalBeds: beds.length,
        pendingTasks,
        activeAlerts: alerts.length,
        unpaidBills: bills.length,
        pendingVisits: visits.length,
      });

      const todayTasks = tasks
        .filter(t => t.taskDate === dayjs().format('YYYY-MM-DD'))
        .slice(0, 10);
      setRecentTasks(todayTasks);

      const sortedAlerts = [...alerts].sort((a, b) => 
        new Date(b.createTime) - new Date(a.createTime)
      ).slice(0, 10);
      setRecentAlerts(sortedAlerts);

    } catch (error) {
      message.error('加载仪表盘数据失败');
      console.error(error);
    }
  };

  const statCards = [
    {
      title: '在住老人',
      value: stats.activeElders,
      icon: <UserOutlined />,
      color: '#1890ff',
      suffix: `/ ${stats.totalElders}`,
    },
    {
      title: '可用床位',
      value: stats.availableBeds,
      icon: <HomeOutlined />,
      color: '#52c41a',
      suffix: `/ ${stats.totalBeds}`,
    },
    {
      title: '待处理任务',
      value: stats.pendingTasks,
      icon: <MedicineBoxOutlined />,
      color: '#faad14',
    },
    {
      title: '活跃告警',
      value: stats.activeAlerts,
      icon: <BellOutlined />,
      color: '#ff4d4f',
    },
    {
      title: '未缴账单',
      value: stats.unpaidBills,
      icon: <WalletOutlined />,
      color: '#722ed1',
    },
    {
      title: '待探访',
      value: stats.pendingVisits,
      icon: <TeamOutlined />,
      color: '#13c2c2',
    },
  ];

  const taskColumns = [
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
      render: (status) => {
        let color = 'default';
        if (status === 'COMPLETED') color = 'green';
        if (status === 'PENDING') color = 'orange';
        if (status === 'PAUSED') color = 'default';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const alertColumns = [
    {
      title: '类型',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type) => {
        const typeMap = {
          TASK_DELAY: '任务延迟',
          FINANCIAL_OVERDUE: '费用逾期',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      render: (level) => {
        let color = 'default';
        if (level === 'CRITICAL') color = 'red';
        if (level === 'WARNING') color = 'orange';
        if (level === 'INFO') color = 'blue';
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: '老人',
      dataIndex: 'elderName',
      key: 'elderName',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                suffix={card.suffix}
                valueStyle={{ color: card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="今日护理任务">
            <Table
              columns={taskColumns}
              dataSource={recentTasks}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="活跃告警">
            <Table
              columns={alertColumns}
              dataSource={recentAlerts}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
