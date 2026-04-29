import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Divider,
  message,
  Steps,
  Tag,
  Descriptions,
  Modal,
  Table,
} from 'antd';
import { SaveOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { elderApi, billApi, checkOutApi } from '../api';

const { Step } = Steps;
const { TextArea } = Input;

const CheckOut = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elders, setElders] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const eldersRes = await elderApi.getActive();
      setElders(eldersRes.data);
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleElderSelect = async (elderId) => {
    const elder = elders.find(e => e.id === elderId);
    setSelectedElder(elder);

    if (elder) {
      try {
        const billsRes = await billApi.getByElder(elderId);
        const unpaid = billsRes.data.filter(b => 
          b.status === 'UNPAID' || b.status === 'PARTIAL_PAID'
        );
        setUnpaidBills(unpaid);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const showConfirmModal = () => {
    setConfirmVisible(true);
  };

  const handleCheckOut = async () => {
    try {
      const values = form.getFieldsValue();
      setLoading(true);
      
      const response = await checkOutApi.checkOut(selectedElder.id, values.reason);
      
      if (response.data.success) {
        message.success('退住办理成功！');
        setConfirmVisible(false);
        form.resetFields();
        setCurrentStep(0);
        setSelectedElder(null);
        setUnpaidBills([]);
        loadData();
      } else {
        message.error(response.data.message || '退住办理失败');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.hasUnpaidBills) {
          message.error('存在未结清的费用，需先结清费用');
        } else {
          message.error(data.message || '退住办理失败');
        }
      } else {
        message.error('退住办理失败');
      }
      console.error(error);
    } finally {
      setLoading(false);
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
      <span>
        <Tag color={colorMap[status] || 'default'}>
          {textMap[status] || status}
        </Tag>
        {record.overdueDays > 0 && (
          <Tag color="red">逾期{record.overdueDays}天</Tag>
        )}
      </span>
    );
  };

  const billColumns = [
    {
      title: '账单编号',
      dataIndex: 'billNo',
      key: 'billNo',
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
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <strong>¥{amount}</strong>,
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
      render: (amount) => <span style={{ color: '#ff4d4f' }}>¥{amount}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => getStatusTag(status, record),
    },
  ];

  const steps = [
    {
      title: '选择老人',
      icon: <UserOutlined />,
    },
    {
      title: '费用结算',
      icon: <WalletOutlined />,
    },
    {
      title: '确认退住',
      icon: <SaveOutlined />,
    },
  ];

  return (
    <div>
      <Card title="退住办理">
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {currentStep === 0 && (
          <div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="elderId"
                label="选择退住老人"
                rules={[{ required: true, message: '请选择退住老人' }]}
              >
                <Select
                  placeholder="请选择退住老人"
                  style={{ width: 400 }}
                  onChange={handleElderSelect}
                >
                  {elders.map(elder => (
                    <Select.Option key={elder.id} value={elder.id}>
                      {elder.name} ({elder.gender}, {elder.age}岁)
                      {elder.isTemporaryLeave && <Tag color="orange" style={{ marginLeft: 8 }}>临时外出</Tag>}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>

            {selectedElder && (
              <Card title="老人信息" size="small" style={{ marginTop: 16 }}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="姓名">{selectedElder.name}</Descriptions.Item>
                  <Descriptions.Item label="性别">{selectedElder.gender}</Descriptions.Item>
                  <Descriptions.Item label="年龄">{selectedElder.age}岁</Descriptions.Item>
                  <Descriptions.Item label="身份证号">{selectedElder.idCard || '-'}</Descriptions.Item>
                  <Descriptions.Item label="护理等级">
                    {selectedElder.careLevel}
                  </Descriptions.Item>
                  <Descriptions.Item label="健康状态">{selectedElder.healthStatus}</Descriptions.Item>
                  <Descriptions.Item label="床位">{selectedElder.bedId || '-'}</Descriptions.Item>
                  <Descriptions.Item label="入住日期">{selectedElder.checkInDate}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button type="primary" onClick={nextStep} disabled={!selectedElder}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            {unpaidBills.length > 0 ? (
              <div>
                <div style={{ color: '#ff4d4f', marginBottom: 16, fontSize: 14 }}>
                  <strong>⚠️ 存在未结清的费用，请先结清费用再办理退住</strong>
                </div>
                <Table
                  columns={billColumns}
                  dataSource={unpaidBills}
                  rowKey="id"
                  size="small"
                  pagination={false}
                />
                <Card size="small" style={{ marginTop: 16, backgroundColor: '#fff1f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>未支付总金额：</span>
                    <strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                      ¥{unpaidBills.reduce((sum, bill) => sum + parseFloat(bill.unpaidAmount || 0), 0).toFixed(2)}
                    </strong>
                  </div>
                </Card>
              </div>
            ) : (
              <div>
                <div style={{ color: '#52c41a', marginBottom: 16, fontSize: 14 }}>
                  <strong>✅ 费用已结清，可以办理退住</strong>
                </div>
                <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>费用结算状态</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      已结清
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
              <Form.Item name="reason" label="退住原因">
                <TextArea placeholder="请输入退住原因" rows={3} />
              </Form.Item>
            </Form>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={prevStep}>上一步</Button>
              <Button type="primary" onClick={nextStep} disabled={unpaidBills.length > 0}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Card title="退住信息确认" size="small">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="姓名">{selectedElder?.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{selectedElder?.gender}</Descriptions.Item>
                <Descriptions.Item label="年龄">{selectedElder?.age}岁</Descriptions.Item>
                <Descriptions.Item label="护理等级">{selectedElder?.careLevel}</Descriptions.Item>
                <Descriptions.Item label="床位">{selectedElder?.bedId || '-'}</Descriptions.Item>
                <Descriptions.Item label="入住日期">{selectedElder?.checkInDate}</Descriptions.Item>
                <Descriptions.Item label="退住日期" span={2}>
                  {new Date().toLocaleDateString('zh-CN')}
                </Descriptions.Item>
                <Descriptions.Item label="退住原因" span={2}>
                  {form.getFieldValue('reason') || '-'}
                </Descriptions.Item>
              </Descriptions>

              <Divider>退住后将执行以下操作</Divider>
              <ul style={{ paddingLeft: 20 }}>
                <li>结清费用确认</li>
                <li>释放床位</li>
                <li>归档护理记录</li>
                <li>取消未执行的护理任务</li>
                <li>停用用药计划</li>
              </ul>
            </Card>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={prevStep}>上一步</Button>
              <Button type="primary" danger onClick={showConfirmModal}>
                确认退住
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        title="确认退住"
        open={confirmVisible}
        onOk={handleCheckOut}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={loading}
        okText="确认退住"
        cancelText="取消"
      >
        <p>确认要为老人 <strong>{selectedElder?.name}</strong> 办理退住吗？</p>
        <p style={{ color: '#faad14' }}>
          ⚠️ 退住后将释放床位、归档护理记录、取消未执行任务。此操作不可撤销。
        </p>
      </Modal>
    </div>
  );
};

export default CheckOut;
