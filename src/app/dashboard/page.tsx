// src/app/dashboard/page.tsx  
'use client';
import Link from 'next/link';
import { FaChartBar, FaGavel, FaBook, FaHome , FaQrcode } from 'react-icons/fa';
import { RiLiveLine, RiCalendarEventLine,RiMoneyDollarCircleLine, RiShareForwardLine,RiBuildingLine ,RiWallet3Line   } from 'react-icons/ri'; 
import { Row, Col, Card } from 'antd';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '2rem' }}>
        Dashboard Section
      </h1>

      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Link href="/dashboard/analytics">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <RiMoneyDollarCircleLine  size={48} style={{ color: '#1890ff' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>Analytics Dashboard</div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/dashboard/my-bids">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <FaGavel size={48} style={{ color: '#52c41a' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>My Bids Dashboard</div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/dashboard/my-booking">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <FaBook size={48} style={{ color: '#722ed1' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>My Booking</div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/dashboard/auction">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <FaGavel  size={48} style={{ color: 'red' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>My Auction</div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/dashboard/live/streamid">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <RiLiveLine  size={48} style={{ color: 'red' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>Go Live</div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/dashboard/event-section">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <RiCalendarEventLine  size={48} style={{ color: 'green' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>My Event</div>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/">
            <Card
              hoverable
              style={{ textAlign: 'center', borderRadius: 16 }}
              bodyStyle={{ padding: 24 }}
            >
              <FaHome size={48} style={{ color: '#faad14' }} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>Dashboard Home</div>
            </Card>
          </Link>
        </Col>
<Col xs={24} sm={12} md={6}>
  <Link href="dashboard/qr-code">
    <Card
      hoverable
      style={{ textAlign: 'center', borderRadius: 16 }}
      bodyStyle={{ padding: 24 }}
    >
      <FaQrcode size={48} style={{ color: '#52c41a' }} /> {/* QR Code Icon */}
      <div style={{ marginTop: 12, fontWeight: 600 }}>Qr-Code</div>
    </Card>
  </Link>
</Col>
<Col xs={24} sm={12} md={6}>
  <Link href="dashboard/wallet">
    <Card
      hoverable
      style={{ textAlign: 'center', borderRadius: 16 }}
      bodyStyle={{ padding: 24 }}
    >
      <RiShareForwardLine size={48} style={{ color: '#13e4d9ff' }} /> {/* QR Code Icon */}
      <div style={{ marginTop: 12, fontWeight: 600 }}>Refrral</div>
    </Card>
  </Link>
</Col>
<Col xs={24} sm={12} md={6}>
  <Link href="dashboard/wallet">
    <Card
      hoverable
      style={{ textAlign: 'center', borderRadius: 16 }}
      bodyStyle={{ padding: 24 }}
    >
      <RiWallet3Line  size={48} style={{ color: '#c4801aff' }} /> {/* QR Code Icon */}
      <div style={{ marginTop: 12, fontWeight: 600 }}>Wallet</div>
    </Card>
  </Link>
</Col>
<Col xs={24} sm={12} md={6}>
  <Link href="dashboard/busniess-to-business">
    <Card
      hoverable
      style={{ textAlign: 'center', borderRadius: 16 }}
      bodyStyle={{ padding: 24 }}
    >
      <RiBuildingLine  size={48} style={{ color: '#201ac4ff' }} /> {/* QR Code Icon */}
      <div style={{ marginTop: 12, fontWeight: 600 }}>B-2-B</div>
    </Card>
  </Link>
</Col>
        
      </Row>
      
    </div>
  );
}