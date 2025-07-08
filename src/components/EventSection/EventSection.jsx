'use client';

import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Select,
  InputNumber,
  Tabs,
  Table,
  Progress,
  message,
} from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

import axios from 'axios';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { loadGoogleMaps } from '@/utils'; // ✅ make sure path is correct

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const dummyRSVPs = [
  { key: '1', name: 'Alice', email: 'alice@example.com', ticketId: 'TCKT-001', status: 'Paid' },
  { key: '2', name: 'Bob', email: 'bob@example.com', ticketId: 'TCKT-002', status: 'Free' },
];

const DEFAULT_CENTER = { lat: 51.505, lng: -0.09 };

export default function EventPage() {
  const [form] = Form.useForm();
  const [rsvpForm] = Form.useForm();
  const [published, setPublished] = useState(false);
  const [eventData, setEventData] = useState({});
  const [bookings, setBookings] = useState(dummyRSVPs);
  const [position, setPosition] = useState(DEFAULT_CENTER);

  const { isLoaded } = loadGoogleMaps(); // ✅ use custom loader

  const handleSaveDraft = () => {
    form.validateFields().then(values => {
      setEventData({ ...values, latitude: position.lat, longitude: position.lng });
      message.success('Saved as Draft');
    });
  };

  const handlePublish = () => {
    form.validateFields().then(values => {
      setEventData({ ...values, latitude: position.lat, longitude: position.lng });
      setPublished(true);
      message.success('Event Published');
    });
  };

  const handleRSVP = values => {
    const id = `TCKT-${bookings.length + 1}`;
    const entry = {
      key: id,
      ticketId: id,
      status: values.ticketType === 'Paid' ? 'Paid' : 'Free',
      ...values,
    };
    setBookings(prev => [...prev, entry]);
    message.success(`Booking Successful! ID: ${id}`);
    rsvpForm.resetFields();
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });

          try {
            const res = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const address = res.data?.results?.[0]?.formatted_address || '';
            message.success(`📍 Location set: ${address}`);
          } catch (err) {
            console.error(err);
            message.error('Failed to fetch address');
          }
        },
        () => {
          message.error('Location permission denied');
        }
      );
    } else {
      message.error('Geolocation not supported');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Ticket ID', dataIndex: 'ticketId' },
    { title: 'Payment Status', dataIndex: 'status' },
    { title: 'QR Code', dataIndex: 'ticketId', render: id => <span>🔳 {id}</span> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Create Event" key="1">
          <Card>
            {isLoaded && (
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="title" label="Event Title" rules={[{ required: true }]}>
                      <Input placeholder="Enter event title" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="datetime" label="Date & Time" rules={[{ required: true }]}>
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Location Coordinates">
                      <Input
                        value={`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Button onClick={getCurrentLocation} style={{ marginBottom: 12 }}>
                      📍 Use My Current Location
                    </Button>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '300px', marginBottom: 16 }}
                      center={position}
                      zoom={13}
                      onClick={e => {
                        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                        setPosition(newPos);
                      }}
                    >
                      <Marker position={position} />
                    </GoogleMap>
                  </Col>

                  <Col xs={24}>
                    <Form.Item name="description" label="Description">
                      <TextArea rows={4} placeholder="Event description" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="image" label="Upload Image">
                      <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="ticketType" label="Ticket Type" rules={[{ required: true }]}>
                      <Select placeholder="Select ticket type">
                        <Option value="Free">Free</Option>
                        <Option value="Paid">Paid</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="ticketLimit" label="Ticket Quantity Limit" rules={[{ required: true }]}>
                      <InputNumber style={{ width: '100%' }} min={1} placeholder="Max tickets" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button onClick={handleSaveDraft} style={{ marginRight: 8 }}>
                    Save as Draft
                  </Button>
                  <Button type="primary" onClick={handlePublish}>
                    Publish
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </TabPane>

        {published && (
          <TabPane tab="RSVP / Booking" key="2">
            <Card title="Event Details" style={{ marginBottom: 24 }}>
              <p><strong>Title:</strong> {eventData.title}</p>
              <p><strong>Date & Time:</strong> {eventData.datetime?.format('YYYY-MM-DD HH:mm')}</p>
              <p><strong>Coordinates:</strong> {eventData.latitude.toFixed(4)}, {eventData.longitude.toFixed(4)}</p>
              <p><strong>Description:</strong> {eventData.description}</p>
              {eventData.image?.file && (
                <img
                  src={URL.createObjectURL(eventData.image.file)}
                  alt="event"
                  style={{ maxWidth: '100%' }}
                />
              )}
            </Card>
            <Card title="RSVP / Book Now">
              <Form
                form={rsvpForm}
                layout="vertical"
                onFinish={handleRSVP}
                initialValues={{ ticketType: eventData.ticketType }}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                      <Input placeholder="Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[{ required: true, type: 'email' }]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                      <Input placeholder="Phone" />
                    </Form.Item>
                  </Col>
                </Row>
                {eventData.ticketType === 'Paid' && (
                  <Form.Item name="payment" label="Payment Amount">
                    <Input prefix="$" disabled placeholder={`$${eventData.ticketLimit}`} />
                  </Form.Item>
                )}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        )}

        {published && (
          <TabPane tab="Ticket Management" key="3">
            <Card>
              <p><strong>Tickets Booked:</strong> {bookings.length}/{eventData.ticketLimit}</p>
              <Progress percent={Math.round((bookings.length / eventData.ticketLimit) * 100)} />
              <Button icon={<DownloadOutlined />} style={{ marginBottom: 16 }}>
                Export to CSV
              </Button>
              <Table columns={columns} dataSource={bookings} pagination={false} />
            </Card>
          </TabPane>
        )}
      </Tabs>
    </div>
  );
}
