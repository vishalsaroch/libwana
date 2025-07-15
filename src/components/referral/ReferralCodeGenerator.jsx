'use client'

import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  message,
  Spin,
  Input,
  Tooltip,
  Badge,
  Divider,
  Row,
  Col,
  Statistic,
  Table,
  Modal,
  Form,
  Alert,
} from 'antd';
import {
  GiftOutlined,
  CopyOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  DollarOutlined,
  TeamOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { userSignUpData } from '@/redux/reuducer/authSlice';

const { Title, Text, Paragraph } = Typography;

export default function ReferralCodeGenerator() {
  const [referralCode, setReferralCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    referralHistory: []
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const userData = useSelector(userSignUpData);

  useEffect(() => {
    if (userData) {
      loadReferralData();
    }
  }, [userData]);

  // Generate unique referral code
  const generateReferralCode = (username, email) => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const userPrefix = username 
      ? username.substring(0, 3).toUpperCase() 
      : email 
        ? email.substring(0, 3).toUpperCase()
        : 'USR';
    return `${userPrefix}${timestamp}${random}`;
  };

  // Load referral data from API
  const loadReferralData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/referral?user_id=${userData?.firebase_id}`);
      const data = await response.json();
      
      if (!data.error) {
        setReferralCode(data.data.user_referral_code || '');
        setReferralStats({
          totalReferrals: data.data.total_referrals || 0,
          totalEarnings: data.data.referral_earnings || 0,
          referralHistory: data.data.referrals || []
        });
      } else {
        // If user not found, set empty data
        setReferralCode('');
        setReferralStats({
          totalReferrals: 0,
          totalEarnings: 0,
          referralHistory: []
        });
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
      // Set empty data on error
      setReferralCode('');
      setReferralStats({
        totalReferrals: 0,
        totalEarnings: 0,
        referralHistory: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate new referral code
  const handleGenerateCode = async () => {
    if (!userData) {
      message.error('Please login first');
      return;
    }

    setIsGenerating(true);
    try {
      const newCode = generateReferralCode(userData.name, userData.email);
      
      // Save to database
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.firebase_id,
          username: userData.name || userData.email,
          generate_code: true
        })
      });

      const data = await response.json();
      
      if (!data.error) {
        const generatedCode = data.data.referral_code;
        setReferralCode(generatedCode);
        message.success('Referral code generated successfully!');
        
        // Save to localStorage
        localStorage.setItem(`referral_code_${userData.firebase_id}`, generatedCode);
        
        // Reload referral data to update stats
        loadReferralData();
        
      } else {
        message.error(data.message || 'Failed to generate referral code');
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      message.error('Failed to generate referral code');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      message.success('Referral code copied to clipboard!');
    }
  };

  // Share referral code
  const shareReferralCode = () => {
    if (!referralCode) return;
    
    const shareText = `Join our platform using my referral code: ${referralCode} and get $40 bonus in your wallet!`;
    const shareUrl = `${window.location.origin}/register?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join with my referral code',
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      message.success('Referral link copied to clipboard!');
    }
  };

  // Referral history table columns
  const columns = [
    {
      title: 'Referred User',
      dataIndex: 'referred_user_name',
      key: 'referred_user_name',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Reward',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount) => (
        <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
          ${amount}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status.toUpperCase()} 
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <GiftOutlined style={{ color: '#52c41a' }} /> Referral System
        </Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card 
              title="Your Referral Code" 
              extra={
                <Tooltip title="Generate new code">
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleGenerateCode}
                    loading={isGenerating}
                    size="small"
                  >
                    Generate
                  </Button>
                </Tooltip>
              }
            >
              {loading ? (
                <Spin />
              ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                      value={referralCode || 'No code generated'}
                      readOnly
                      size="large"
                      style={{ 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        textAlign: 'center',
                        backgroundColor: referralCode ? '#f6ffed' : '#f5f5f5'
                      }}
                    />
                    <Tooltip title="Copy code">
                      <Button 
                        icon={<CopyOutlined />} 
                        onClick={copyReferralCode}
                        disabled={!referralCode}
                      />
                    </Tooltip>
                  </div>
                  
                  <Space>
                    <Button
                      type="primary"
                      icon={<ShareAltOutlined />}
                      onClick={shareReferralCode}
                      disabled={!referralCode}
                    >
                      Share Code
                    </Button>
                    <Button
                      icon={<InfoCircleOutlined />}
                      onClick={() => setIsModalVisible(true)}
                    >
                      How it Works
                    </Button>
                  </Space>
                </Space>
              )}
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="Referral Statistics">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Total Referrals"
                    value={referralStats.totalReferrals}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Earnings"
                    value={referralStats.totalEarnings}
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

        <Card title="Referral History">
          <Table
            columns={columns}
            dataSource={referralStats.referralHistory}
            pagination={{ pageSize: 10 }}
            loading={loading}
            locale={{ emptyText: 'No referrals yet. Share your code to start earning!' }}
          />
        </Card>

        {/* How it Works Modal */}
        <Modal
          title={<span><GiftOutlined /> How Referrals Work</span>}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="Earn $40 for Each Referral"
              description="When someone signs up using your referral code, both you and your friend get $40 added to your wallets instantly!"
              type="success"
              showIcon
            />
            
            <Card size="small">
              <Title level={5}>📋 How to Use</Title>
              <ol>
                <li>Generate your unique referral code</li>
                <li>Share your code with friends</li>
                <li>They enter your code during registration</li>
                <li>$40 is added to both wallets immediately</li>
              </ol>
            </Card>

            <Card size="small">
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
      </Card>
    </div>
  );
}
