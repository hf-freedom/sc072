import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  HomeFilled,
  MedicineBoxOutlined,
  TeamOutlined,
  WalletOutlined,
  BellOutlined,
  PlusOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ElderManagement from './pages/ElderManagement';
import RoomManagement from './pages/RoomManagement';
import CareTaskManagement from './pages/CareTaskManagement';
import MedicationManagement from './pages/MedicationManagement';
import VisitManagement from './pages/VisitManagement';
import BillManagement from './pages/BillManagement';
import AlertManagement from './pages/AlertManagement';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: '老人管理',
      children: [
        { key: '2-1', label: <Link to="/elders">老人列表</Link> },
        { key: '2-2', label: <Link to="/check-in">入住登记</Link> },
        { key: '2-3', label: <Link to="/check-out">退住办理</Link> },
      ],
    },
    {
      key: '3',
      icon: <HomeFilled />,
      label: <Link to="/rooms">房间床位</Link>,
    },
    {
      key: '4',
      icon: <MedicineBoxOutlined />,
      label: '护理管理',
      children: [
        { key: '4-1', label: <Link to="/care-tasks">护理任务</Link> },
        { key: '4-2', label: <Link to="/medications">用药计划</Link> },
      ],
    },
    {
      key: '5',
      icon: <TeamOutlined />,
      label: <Link to="/visits">探访管理</Link>,
    },
    {
      key: '6',
      icon: <WalletOutlined />,
      label: <Link to="/bills">费用账单</Link>,
    },
    {
      key: '7',
      icon: <BellOutlined />,
      label: <Link to="/alerts">异常告警</Link>,
    },
  ];

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="dark"
        >
          <div
            style={{
              height: 64,
              margin: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: collapsed ? 14 : 18,
              fontWeight: 'bold',
            }}
          >
            {collapsed ? '养老院' : '养老院管理系统'}
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: colorBgContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500 }}>养老院管理系统</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span>管理员</span>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/elders" element={<ElderManagement />} />
              <Route path="/rooms" element={<RoomManagement />} />
              <Route path="/care-tasks" element={<CareTaskManagement />} />
              <Route path="/medications" element={<MedicationManagement />} />
              <Route path="/visits" element={<VisitManagement />} />
              <Route path="/bills" element={<BillManagement />} />
              <Route path="/alerts" element={<AlertManagement />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/check-out" element={<CheckOut />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
