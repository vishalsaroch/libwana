'use client'

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Table,
  Alert,
  Divider,
  message,
  Grid,
  Badge,
  Tabs,
  Statistic,
  Space,
  Tag,
  Tooltip,
  Copy,
} from 'antd';
import {
  DollarOutlined,
  LockOutlined,
  PlusOutlined,
  CreditCardOutlined,
  BankOutlined,
  MobileOutlined,
  GiftOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  CopyOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { userSignUpData } from '@/redux/reuducer/authSlice';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

export default function EnhancedWallet() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReferralModalVisible, setIsReferralModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [receipt] = useState('INV-100234');
  const [activeTab, setActiveTab] = useState('1');
  const [walletData, setWalletData] = useState({
    balance: 0,
    escrow_balance: 13,
    referral_earnings: 0,
    total_earned: 0,
    total_spent: 0,
  });
  const [referralData, setReferralData] = useState({
    referral_code: '',
    total_referrals: 0,
    referrals: [],
  });
  const [transactionData, setTransactionData] = useState([
    {
      key: '1',
      date: '07/07/2025',
      amount: '$10.00',
      type: 'Deposit',
      method: 'Mobile Money',
      status: 'Pending',
      receipt: 'INV-100234',
    },
    {
      key: '2',
      date: '06/07/2025',
      amount: '$20.00',
      type: 'Deposit',
      method: 'Visa Card',
      status: 'Confirmed',
      receipt: 'INV-100231',
    },
    {
      key: '3',
      date: '05/07/2025',
      amount: '$40.00',
      type: 'Referral Bonus',
      method: 'Referral System',
      status: 'Confirmed',
      receipt: 'REF-100001',
    },
  ]);

  const screens = useBreakpoint();
  const userData = useSelector(userSignUpData);

  useEffect(() => {
    // Load wallet and referral data
    loadWalletData();
    loadReferralData();
  }, [userData]);

  const loadWalletData = async () => {
    try {
      // API call to get wallet data
      // For demo, using mock data
      setWalletData({
        balance: 40,
        escrow_balance: 13,
        referral_earnings: 40,
        total_earned: 40,
        total_spent: 0,
      });
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const loadReferralData = async () => {
    try {
      // API call to get referral data
      // For demo, using mock data
      setReferralData({
        referral_code: 'USR12345ABC',
        total_referrals: 1,
        referrals: [
          {
            id: '1',
            referred_user_name: 'John Doe',
            created_at: '2025-01-14T07:00:00Z',
            reward_amount: 40,
            status: 'active',
          },
        ],
      });
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const showReferralModal = () => setIsReferralModalVisible(true);
  const handleReferralCancel = () => setIsReferralModalVisible(false);

  const handleProceed = () => {
    form.validateFields().then((values) => {
      const newTransaction = {
        key: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB'),
        amount: `$${values.amount.toFixed(2)}`,
        type: 'Deposit',
        method:
          values.method === 'credit'
            ? 'Visa Card'
            : values.method === 'mobile'
            ? 'Mobile Money'
            : 'Bank Deposit',
        status: 'Pending',
        receipt: receipt,
      };
      setTransactionData([newTransaction, ...transactionData]);
      setWalletData((prev) => ({
        ...prev,
        balance: prev.balance + values.amount,
        total_earned: prev.total_earned + values.amount,
      }));
      setIsModalVisible(false);
      message.success('Funds added successfully!');
      form.resetFields();
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referral_code);
    message.success('Referral code copied to clipboard!');
  };

  const shareReferralCode = () => {
    const shareText = `Join ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'LibWana'} using my referral code: ${referralData.referral_code} and get $40 bonus!`;
    if (navigator.share) {
      navigator.share({
        title: 'Join LibWana',
        text: shareText,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      message.success('Referral message copied to clipboard!');
    }
  };

  const transactionColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount, record) => (
        <Text style={{ color: record.type === 'Referral Bonus' ? '#52c41a' : '#1890ff' }}>
          {amount}
        </Text>
      )
    },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Referral Bonus' ? 'green' : 'blue'}>
          {type}
        </Tag>
      )
    },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'Confirmed' ? 'success' : 'processing'} 
          text={status} 
        />
      )
    },
    { title: 'Receipt No.', dataIndex: 'receipt', key: 'receipt' },
  ];

  const referralColumns = [
    { title: 'Referred User', dataIndex: 'referred_user_name', key: 'referred_user_name' },
    { 
      title: 'Date', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('en-GB')
    },
    { 
      title: 'Reward', 
      dataIndex: 'reward_amount', 
      key: 'reward_amount',
      render: (amount) => <Text style={{ color: '#52c41a' }}>${amount}</Text>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status} 
        />
      )
    },
  ];

  return (
    <Layout style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ background: '#fff', marginBottom: 24 }}>
        <Title level={screens.xs ? 4 : 3} style={{ marginBottom: 0 }}>
          💼 Wallet Dashboard
        </Title>
        <Text type="secondary">Manage your funds, transactions, and referrals with ease.</Text>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="💰 Wallet" key="1">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card bordered hoverable style={{ backgroundColor: '#fafafa' }}>
                <Statistic
                  title="Total Balance"
                  value={walletData.balance}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered hoverable style={{ backgroundColor: '#fafafa' }}>
                <Statistic
                  title="Escrow Balance"
                  value={walletData.escrow_balance}
                  precision={2}
                  prefix={<LockOutlined />}
                  suffix="USD"
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Funds in escrow are held until delivery is confirmed.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered hoverable style={{ backgroundColor: '#f6ffed' }}>
                <Statistic
                  title="Referral Earnings"
                  value={walletData.referral_earnings}
                  precision={2}
                  prefix={<GiftOutlined />}
                  suffix="USD"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered hoverable style={{ backgroundColor: '#fafafa' }}>
                <Statistic
                  title="Total Earned"
                  value={walletData.total_earned}
                  precision={2}
                  prefix={<TrophyOutlined />}
                  suffix="USD"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered hoverable style={{ backgroundColor: '#fafafa' }}>
                <Statistic
                  title="Total Spent"
                  value={walletData.total_spent}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered style={{ backgroundColor: '#f6ffed', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Button icon={<PlusOutlined />} type="primary" size="large" onClick={showModal} block={screens.xs}>
                  Add Funds
                </Button>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card title="📋 Transaction History" bordered style={{ marginBottom: 24 }}>
            <Table
              columns={transactionColumns}
              dataSource={transactionData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
            />
          </Card>

          <Card bordered style={{ backgroundColor: '#fffbe6' }}>
            <Alert
              message="Withdrawals are not available. All funds are locked for platform use only."
              type="warning"
              showIcon
            />
            <Button type="default" disabled block style={{ marginTop: 16 }}>
              Withdraw Funds
            </Button>
          </Card>
        </TabPane>

        <TabPane tab="🎁 Referrals" key="2">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Your Referral Code" bordered style={{ backgroundColor: '#f6ffed' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input
                      value={referralData.referral_code}
                      readOnly
                      size="large"
                      style={{ fontWeight: 'bold', fontSize: '16px' }}
                    />
                    <Tooltip title="Copy referral code">
                      <Button icon={<CopyOutlined />} onClick={copyReferralCode} />
                    </Tooltip>
                  </div>
                  <Space>
                    <Button
                      type="primary"
                      icon={<ShareAltOutlined />}
                      onClick={shareReferralCode}
                    >
                      Share Code
                    </Button>
                    <Button
                      icon={<UserAddOutlined />}
                      onClick={showReferralModal}
                    >
                      How it Works
                    </Button>
                  </Space>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Referral Stats" bordered>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Total Referrals"
                      value={referralData.total_referrals}
                      prefix={<TeamOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Referral Earnings"
                      value={walletData.referral_earnings}
                      precision={2}
                      prefix={<DollarOutlined />}
                      suffix="USD"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Card title="📋 Referral History" bordered>
            <Table
              columns={referralColumns}
              dataSource={referralData.referrals}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              bordered
              locale={{ emptyText: 'No referrals yet. Share your code to earn rewards!' }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Add Funds Modal */}
      <Modal
        title={<span><PlusOutlined /> Add Funds</span>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={screens.xs ? '90%' : 600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="amount" label="Amount to Add" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Enter amount (e.g. $10.00)"
            />
          </Form.Item>

          <Form.Item name="method" label="Choose Payment Method" rules={[{ required: true }]}>
            <Select placeholder="Select method">
              <Option value="credit"><CreditCardOutlined /> Credit Card / Visa / Debit</Option>
              <Option value="mobile"><MobileOutlined /> Mobile Money</Option>
              <Option value="bank"><BankOutlined /> Bank Deposit</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Text>Generated Receipt Number: <Text code>{receipt}</Text></Text>
          </Form.Item>

          <Form.Item>
            <Text type="secondary">
              Use this receipt number when sending payment via Mobile Money or Bank Deposit. Funds will be added after confirmation.
            </Text>
          </Form.Item>

          <Form.Item>
            <Button type="primary" block onClick={handleProceed}>Proceed</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Referral Info Modal */}
      <Modal
        title={<span><GiftOutlined /> How Referrals Work</span>}
        open={isReferralModalVisible}
        onCancel={handleReferralCancel}
        footer={[
          <Button key="close" onClick={handleReferralCancel}>
            Close
          </Button>
        ]}
        width={screens.xs ? '90%' : 600}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
            <Title level={5}>💰 Earn $40 for Each Referral</Title>
            <Paragraph>
              When someone signs up using your referral code, both you and your friend get $40 added to your wallets instantly!
            </Paragraph>
          </Card>

          <Card size="small" style={{ backgroundColor: '#f0f5ff' }}>
            <Title level={5}>📋 How to Use</Title>
            <ol>
              <li>Share your referral code with friends</li>
              <li>They enter your code during registration</li>
              <li>$40 is added to both wallets immediately</li>
              <li>Start earning and spending on the platform</li>
            </ol>
          </Card>

          <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
            <Title level={5}>⚠️ Important Notes</Title>
            <ul>
              <li>Each user can only use one referral code</li>
              <li>You cannot use your own referral code</li>
              <li>Bonus funds are locked to platform use only</li>
              <li>All transactions are tracked and monitored</li>
            </ul>
          </Card>
        </Space>
      </Modal>
    </Layout>
  );
}
