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
  message,
  Descriptions,
  Popconfirm,
} from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { billApi, elderApi } from '../api';
import dayjs from 'dayjs';

const BillManagement = () => {
  const [bills, setBills] = useState([]);
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [billsRes, eldersRes] = await Promise.all([
        billApi.getAll(),
        elderApi.getActive(),
      ]);
      setBills(billsRes.data);
      setElders(eldersRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (record) => {
    setSelectedBill(record);
    setDetailVisible(true);
  };

  const showPayModal = (record) => {
    setSelectedBill(record);
    form.setFieldsValue({
      amount: record.unpaidAmount,
      paymentMethod: '现金',
    });
    setPayModalVisible(true);
  };

  const handlePay = async () => {
    try {
      const values = await form.validateFields();
      await billApi.pay(selectedBill.id, values.amount, values.paymentMethod);
      message.success('支付成功');
      setPayModalVisible(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusTag = (status, record) => {
    const colorMap = {
      PAID: 'green',
      UNPAID: 'orange',
      PARTIAL_PAID: 'blue',
    };
    const textMap = {
      PAID: '已结清',
      UNPAID: '未支付',
      PARTIAL_PAID: '部分支付',
    };
    return (
      <Space>
        <Tag color={colorMap[status] || 'default'}>
          {textMap[status] || status}
        </Tag>
        {record.overdueDays > 0 && (
          <Tag color="red">逾期{record.overdueDays}天</Tag>
        )}
      </Space>
    );
  };

  const columns = [
    {
      title: '账单编号',
      dataIndex: 'billNo',
      key: 'billNo',
    },
    {
      title: '老人姓名',
      dataIndex: 'elderName',
      key: 'elderName',
    },
    {
      title: '账单月份',
      key: 'billMonth',
      render: (_, record) => (
        <span>{record.billYear}年{record.billMonth}月</span>
      ),
    },
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '床位费',
      dataIndex: 'bedFee',
      key: 'bedFee',
      render: (fee) => `¥${fee}`,
    },
    {
      title: '护理费',
      dataIndex: 'careFee',
      key: 'careFee',
      render: (fee) => `¥${fee}`,
    },
    {
      title: '药品费',
      dataIndex: 'medicationFee',
      key: 'medicationFee',
      render: (fee) => `¥${fee}`,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <strong style={{ color: '#ff4d4f' }}>¥{amount}</strong>,
    },
    {
      title: '已支付',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '未支付',
      dataIndex: 'unpaidAmount',
      key: 'unpaidAmount',
      render: (amount) => <span style={{ color: '#faad14' }}>¥{amount}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => getStatusTag(status, record),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(record)}>
            详情
          </Button>
          {record.status !== 'PAID' && (
            <Button type="link" onClick={() => showPayModal(record)}>
            支付
          </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="费用账单管理">
        <Table
          columns={columns}
          dataSource={bills}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
        />
      </Card>

      <Modal
        title="账单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={900}
      >
        {selectedBill && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="账单编号">{selectedBill.billNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedBill.status, selectedBill)}
              </Descriptions.Item>
              <Descriptions.Item label="老人姓名">{selectedBill.elderName}</Descriptions.Item>
              <Descriptions.Item label="账单月份">
                {selectedBill.billYear}年{selectedBill.billMonth}月
              </Descriptions.Item>
              <Descriptions.Item label="账单日期">{selectedBill.billDate}</Descriptions.Item>
              <Descriptions.Item label="到期日期">{selectedBill.dueDate}</Descriptions.Item>
              <Descriptions.Item label="支付方式">{selectedBill.paymentMethod || '-'}</Descriptions.Item>
              <Descriptions.Item label="支付时间">{selectedBill.paidTime || '-'}</Descriptions.Item>
            </Descriptions>

            <h4 style={{ marginTop: 24 }}>费用明细</h4>
            <Descriptions bordered column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="床位费" style={{ backgroundColor: '#fafafa' }}>
                ¥{selectedBill.bedFee}
              </Descriptions.Item>
              <Descriptions.Item label="护理费">
                ¥{selectedBill.careFee}
              </Descriptions.Item>
              <Descriptions.Item label="药品费" style={{ backgroundColor: '#fafafa' }}>
                ¥{selectedBill.medicationFee}
              </Descriptions.Item>
              <Descriptions.Item label="额外服务费">
                ¥{selectedBill.extraServiceFee}
              </Descriptions.Item>
            </Descriptions>

            <Card size="small" style={{ marginTop: 16, backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>总金额：</span>
                <strong style={{ fontSize: 18 }}>¥{selectedBill.totalAmount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span>已支付：</span>
                <span style={{ color: '#52c41a' }}>¥{selectedBill.paidAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span>未支付：</span>
                <span style={{ color: '#ff4d4f' }}>¥{selectedBill.unpaidAmount}</span>
              </div>
            </Card>

            {selectedBill.items && selectedBill.items.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4>账单条目</h4>
                <Table
                  columns={[
                    { title: '类型', dataIndex: 'itemType', key: 'itemType' },
                    { title: '名称', dataIndex: 'itemName', key: 'itemName' },
                    { title: '描述', dataIndex: 'itemDescription', key: 'itemDescription' },
                    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                    { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', render: (p) => `¥${p}` },
                    { title: '金额', dataIndex: 'amount', key: 'amount', render: (a) => `¥${a}` },
                  ]}
                  dataSource={selectedBill.items}
                  rowKey="id"
                  size="small"
                  pagination={false}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="支付账单"
        open={payModalVisible}
        onOk={handlePay}
        onCancel={() => setPayModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label="支付金额"
            rules={[{ required: true, message: '请输入支付金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              prefix="¥"
            />
          </Form.Item>
          <Form.Item
            name="paymentMethod"
            label="支付方式"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select placeholder="请选择支付方式">
              <Select.Option value="现金">现金</Select.Option>
              <Select.Option value="微信支付">微信支付</Select.Option>
              <Select.Option value="支付宝">支付宝</Select.Option>
              <Select.Option value="银行转账">银行转账</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BillManagement;
