import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Alert } from 'antd';

const { Title, Paragraph } = Typography;

// Static services data
const staticServices = [
  {
    id: 1,
    name: 'Haircut',
    description: 'Professional haircut by expert stylists.',
    price: 300,
    active: true,
  },
  {
    id: 2,
    name: 'Spa',
    description: 'Relaxing full body spa session.',
    price: 1200,
    active: false,
  },
  {
    id: 3,
    name: 'Facial',
    description: 'Rejuvenating facial treatment.',
    price: 800,
    active: true,
  },
];

// Component to render individual service
const ServiceCard = ({ service, onBook, isBusiness, onToggleActive }) => (
  <Card
    title={<Title level={4}>{service.name}</Title>}
    bordered
    style={{ borderRadius: '16px' }}
    actions={[
      isBusiness ? (
        <Button type={service.active ? 'default' : 'primary'} onClick={() => onToggleActive(service.id)}>
          {service.active ? 'Deactivate' : 'Activate'}
        </Button>
      ) : (
        <Button type="primary" disabled={!service.active} onClick={() => onBook(service)}>
          {service.active ? 'Book Now' : 'Unavailable'}
        </Button>
      ),
    ]}
  >
    <Paragraph>{service.description}</Paragraph>
    <Paragraph strong>Price: ₹{service.price}</Paragraph>
  </Card>
);

// Main MyBooking page
const Mybooking = ({ isBusinessMode = false }) => {
  const [services, setServices] = useState(staticServices);
  const [error, setError] = useState(null);

  const handleBook = (service) => {
    window.location.href = `/booking/${service.id}`;
  };

  const toggleActive = (id) => {
    setServices((current) =>
      current.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  if (error) return <Alert message={error} type="error" showIcon />;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{isBusinessMode ? 'Manage Your Services' : 'Available Services'}</Title>
      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col xs={24} sm={12} lg={8} key={service.id}>
            <ServiceCard
              service={service}
              onBook={handleBook}
              isBusiness={isBusinessMode}
              onToggleActive={toggleActive}
            />
          </Col>
        ))}
      </Row>
      {!isBusinessMode && (
        <div style={{ marginTop: '24px' }}>
          <Title level={4}>My Bookings</Title>
          {/* This section can be expanded to show user's bookings */}
        </div>
      )}
    </div>
  );
};

export default Mybooking;