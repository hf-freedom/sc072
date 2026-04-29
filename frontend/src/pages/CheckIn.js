import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Divider,
  message,
  Steps,
  InputNumber,
  Space,
  Tag,
} from 'antd';
import { SaveOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { elderApi, roomApi, commonApi, checkInApi } from '../api';
import dayjs from 'dayjs';

const { Step } = Steps;
const { TextArea } = Input;

const CheckIn = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elders, setElders] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [careLevels, setCareLevels] = useState([]);
  const [healthStatusOptions, setHealthStatusOptions] = useState([]);
  const [existingElder, setExistingElder] = useState(false);
  const [selectedElder, setSelectedElder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eldersRes, bedsRes, careLevelsRes, healthStatusRes] = await Promise.all([
        elderApi.getActive(),
        roomApi.getAvailableBeds(),
        commonApi.getCareLevels(),
        commonApi.getHealthStatus(),
      ]);
      setElders(eldersRes.data);
      setAvailableBeds(bedsRes.data);
      setCareLevels(careLevelsRes.data);
      setHealthStatusOptions(healthStatusRes.data);
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

  const handleElderSelect = (elderId, option) => {
    if (elderId === 'new') {
      setExistingElder(false);
      setSelectedElder(null);
      form.resetFields(['name', 'idCard', 'gender', 'birthDate', 'phone', 'address', 'careLevel', 'healthStatus']);
    } else {
      setExistingElder(true);
      const elder = elders.find(e => e.id === elderId);
      setSelectedElder(elder);
      if (elder) {
        form.setFieldsValue({
          elderId: elder.id,
          name: elder.name,
          idCard: elder.idCard,
          gender: elder.gender,
          birthDate: elder.birthDate ? dayjs(elder.birthDate) : null,
          phone: elder.phone,
          address: elder.address,
          careLevel: elder.careLevel,
          healthStatus: elder.healthStatus,
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      let elderData;
      if (existingElder && selectedElder) {
        elderData = selectedElder;
      } else {
        elderData = {
          name: values.name,
          idCard: values.idCard,
          gender: values.gender,
          birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
          phone: values.phone,
          address: values.address,
          careLevel: values.careLevel,
          healthStatus: values.healthStatus,
          status: 'ACTIVE',
        };
      }

      const contactValues = contactForm.getFieldsValue();
      if (contactValues.contactName && !elderData.emergencyContacts) {
        elderData.emergencyContacts = [{
          name: contactValues.contactName,
          relationship: contactValues.contactRelationship,
          phone: contactValues.contactPhone,
          address: contactValues.contactAddress,
          isPrimary: true,
        }];
      }

      const requestData = {
        elder: elderData,
        bedId: values.bedId,
      };

      setLoading(true);
      const response = await checkInApi.checkIn(requestData);
      
      if (response.data.success) {
        message.success({
          content: '入住登记成功！已分配床位并生成护理计划。',
          duration: 3,
        });
        message.info({
          content: '可前往"房间床位管理"页面查看床位状态更新。',
          duration: 5,
        });
        form.resetFields();
        contactForm.resetFields();
        setCurrentStep(0);
        setExistingElder(false);
        setSelectedElder(null);
        loadData();
      } else {
        message.error(response.data.message || '入住登记失败');
      }
    } catch (error) {
      message.error('入住登记失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const careLevelOptions = careLevels.map(level => ({
    value: level.levelCode,
    label: level.levelName,
  }));

  const bedOptions = availableBeds.map(bed => ({
    value: bed.id,
    label: `${bed.bedNumber} (${bed.careArea} - ¥${bed.price}/月)`,
  }));

  const steps = [
    {
      title: '选择老人',
      icon: <UserOutlined />,
    },
    {
      title: '分配床位',
      icon: <HomeOutlined />,
    },
    {
      title: '确认入住',
      icon: <SaveOutlined />,
    },
  ];

  return (
    <div>
      <Card title="入住登记">
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        {currentStep === 0 && (
          <div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="elderSelect"
                label="选择老人"
                rules={[{ required: true, message: '请选择老人' }]}
              >
                <Select placeholder="请选择老人或新建老人信息" onChange={handleElderSelect}>
                  <Select.Option value="new">新建老人信息</Select.Option>
                  <Select.OptGroup label="已在住老人">
                    {elders.map(elder => (
                      <Select.Option key={elder.id} value={elder.id}>
                        {elder.name} ({elder.gender}, {elder.age}岁)
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                </Select>
              </Form.Item>

              <Form.Item name="elderId" hidden>
                <Input />
              </Form.Item>

              <Divider>老人基本信息</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="请输入姓名" disabled={existingElder} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="idCard" label="身份证号">
                    <Input placeholder="请输入身份证号" disabled={existingElder} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gender"
                    label="性别"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <Select placeholder="请选择性别" disabled={existingElder}>
                      <Select.Option value="男">男</Select.Option>
                      <Select.Option value="女">女</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="birthDate" label="出生日期">
                    <DatePicker style={{ width: '100%' }} disabled={existingElder} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="careLevel"
                    label="护理等级"
                    rules={[{ required: true, message: '请选择护理等级' }]}
                  >
                    <Select placeholder="请选择护理等级" options={careLevelOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="healthStatus"
                    label="健康状态"
                    rules={[{ required: true, message: '请选择健康状态' }]}
                  >
                    <Select placeholder="请选择健康状态">
                      {healthStatusOptions.map(status => (
                        <Select.Option key={status} value={status}>{status}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="电话">
                    <Input placeholder="请输入电话" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="address" label="地址">
                    <Input placeholder="请输入地址" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>紧急联系人</Divider>

              <Form form={contactForm} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="contactName" label="联系人姓名">
                      <Input placeholder="请输入联系人姓名" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="contactRelationship" label="关系">
                      <Select placeholder="请选择关系">
                        <Select.Option value="配偶">配偶</Select.Option>
                        <Select.Option value="儿子">儿子</Select.Option>
                        <Select.Option value="女儿">女儿</Select.Option>
                        <Select.Option value="其他亲属">其他亲属</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="contactPhone" label="联系电话">
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="contactAddress" label="联系地址">
                      <Input placeholder="请输入联系地址" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Form>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="bedId"
                label="选择床位"
                rules={[{ required: true, message: '请选择床位' }]}
              >
                <Select placeholder="请选择床位" style={{ width: 400 }}>
                  {bedOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {availableBeds.length === 0 && (
                <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
                  暂无可用床位，请先释放床位
                </div>
              )}
            </Form>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={prevStep}>上一步</Button>
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Card title="入住信息确认" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <p><strong>姓名：</strong>{form.getFieldValue('name')}</p>
                  <p><strong>性别：</strong>{form.getFieldValue('gender')}</p>
                  <p><strong>身份证号：</strong>{form.getFieldValue('idCard') || '-'}</p>
                  <p><strong>护理等级：</strong>
                    {careLevels.find(l => l.levelCode === form.getFieldValue('careLevel'))?.levelName || '-'}
                  </p>
                  <p><strong>健康状态：</strong>{form.getFieldValue('healthStatus') || '-'}</p>
                </Col>
                <Col span={12}>
                  <p><strong>电话：</strong>{form.getFieldValue('phone') || '-'}</p>
                  <p><strong>地址：</strong>{form.getFieldValue('address') || '-'}</p>
                  <p><strong>床位：</strong>
                    {(() => {
                      const bed = availableBeds.find(b => b.id === form.getFieldValue('bedId'));
                      return bed ? `${bed.bedNumber} (${bed.careArea})` : '-';
                    })()}
                  </p>
                  <p><strong>床位价格：</strong>
                    {(() => {
                      const bed = availableBeds.find(b => b.id === form.getFieldValue('bedId'));
                      return bed ? `¥${bed.price}/月` : '-';
                    })()}
                  </p>
                </Col>
              </Row>

              <Divider>费用预览</Divider>
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: '#999' }}>床位费</div>
                      <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                        ¥{(() => {
                          const bed = availableBeds.find(b => b.id === form.getFieldValue('bedId'));
                          return bed ? bed.price : 0;
                        })()}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: '#999' }}>护理费</div>
                      <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                        ¥{(() => {
                          const level = careLevels.find(l => l.levelCode === form.getFieldValue('careLevel'));
                          return level ? level.monthlyFee : 0;
                        })()}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: '#999' }}>药品费</div>
                      <div style={{ fontSize: 18, fontWeight: 'bold' }}>¥0</div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: '#999' }}>预计月费用</div>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fa8c16' }}>
                        ¥{(() => {
                          const bed = availableBeds.find(b => b.id === form.getFieldValue('bedId'));
                          const level = careLevels.find(l => l.levelCode === form.getFieldValue('careLevel'));
                          const bedPrice = bed ? (bed.price || 0) : 0;
                          const carePrice = level ? (level.monthlyFee || 0) : 0;
                          return (parseFloat(bedPrice) + parseFloat(carePrice)).toFixed(2);
                        })()}
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={prevStep}>上一步</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                确认入住
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CheckIn;
