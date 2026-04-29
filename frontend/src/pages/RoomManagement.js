import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table,
  Card,
  Tag,
  Tabs,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Descriptions,
  Badge,
} from 'antd';
import { HomeOutlined, MedicineBoxOutlined, PlusOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { roomApi, commonApi } from '../api';

const RoomManagement = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [careAreas, setCareAreas] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetailVisible, setRoomDetailVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms');

  useEffect(() => {
    loadData();
  }, [location]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bedsRes, careAreasRes, roomTypesRes] = await Promise.all([
        roomApi.getAll(),
        roomApi.getAllBeds(),
        commonApi.getCareAreas(),
        commonApi.getRoomTypes(),
      ]);
      setRooms(roomsRes.data);
      setBeds(bedsRes.data);
      setCareAreas(careAreasRes.data);
      setRoomTypes(roomTypesRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showRoomDetail = async (room) => {
    try {
      const response = await roomApi.getById(room.id);
      setSelectedRoom(response.data);
      setRoomDetailVisible(true);
    } catch (error) {
      message.error('获取房间详情失败');
      console.error(error);
    }
  };

  const roomColumns = [
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text, record) => (
        <Button type="link" onClick={() => showRoomDetail(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: '护理区域',
      dataIndex: 'careArea',
      key: 'careArea',
    },
    {
      title: '房间类型',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: '床位数量',
      dataIndex: 'bedCount',
      key: 'bedCount',
      render: (bedCount, record) => (
        <span>
          {record.occupiedBedCount || 0} / {bedCount}
        </span>
      ),
    },
    {
      title: '基础价格',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price) => `¥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'AVAILABLE' ? 'green' : status === 'FULL' ? 'red' : 'orange'}>
          {status === 'AVAILABLE' ? '可用' : status === 'FULL' ? '已满' : status}
        </Tag>
      ),
    },
  ];

  const bedColumns = [
    {
      title: '床位号',
      dataIndex: 'bedNumber',
      key: 'bedNumber',
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: '护理区域',
      dataIndex: 'careArea',
      key: 'careArea',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space>
          <Tag color={status === 'AVAILABLE' ? 'green' : 'red'}>
            {status === 'AVAILABLE' ? '空闲' : '已占用'}
          </Tag>
          {status === 'OCCUPIED' && (
            <Tag color="blue">{record.elderName}</Tag>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'rooms',
      label: '房间列表',
      children: (
        <Table
          columns={roomColumns}
          dataSource={rooms}
          rowKey="id"
          loading={loading}
        />
      ),
    },
    {
      key: 'beds',
      label: '床位列表',
      children: (
        <Table
          columns={bedColumns}
          dataSource={beds}
          rowKey="id"
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div>
      <Card 
        title="房间床位管理"
        extra={
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
            刷新
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      <Modal
        title="房间详情"
        open={roomDetailVisible}
        onCancel={() => setRoomDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRoom && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="房间号">{selectedRoom.roomNumber}</Descriptions.Item>
              <Descriptions.Item label="护理区域">{selectedRoom.careArea}</Descriptions.Item>
              <Descriptions.Item label="房间类型">{selectedRoom.roomType}</Descriptions.Item>
              <Descriptions.Item label="基础价格">¥{selectedRoom.basePrice}</Descriptions.Item>
              <Descriptions.Item label="床位数量">
                {selectedRoom.occupiedBedCount || 0} / {selectedRoom.bedCount}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedRoom.status === 'AVAILABLE' ? 'green' : 'red'}>
                  {selectedRoom.status === 'AVAILABLE' ? '可用' : '已满'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <h4 style={{ marginTop: 24 }}>床位信息</h4>
            {selectedRoom.beds && selectedRoom.beds.length > 0 ? (
              <Table
                columns={[
                  { title: '床位号', dataIndex: 'bedNumber', key: 'bedNumber' },
                  {
                    title: '价格',
                    dataIndex: 'price',
                    key: 'price',
                    render: (p) => `¥${p}`,
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (s, r) => (
                      <Space>
                        <Tag color={s === 'AVAILABLE' ? 'green' : 'red'}>
                          {s === 'AVAILABLE' ? '空闲' : '已占用'}
                        </Tag>
                        {s === 'OCCUPIED' && r.elderName && (
                          <Tag color="blue">{r.elderName}</Tag>
                        )}
                      </Space>
                    ),
                  },
                ]}
                dataSource={selectedRoom.beds}
                rowKey="id"
                size="small"
                pagination={false}
              />
            ) : (
              <p>暂无床位信息</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomManagement;
