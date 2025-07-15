'use client';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Card,
  Typography,
  Layout,
  Table,
  Drawer,
} from 'antd';
import {
  UploadOutlined,
  AppstoreAddOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;
const { Title } = Typography;
const { Sider, Content } = Layout;

export default function B2BPage() {
  const [form] = Form.useForm();
  const [businessList, setBusinessList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (values) => {
    const newBusiness = {
      ...values,
      id: uuidv4(),
    };
    setBusinessList(prev => [newBusiness, ...prev]);
    form.resetFields();
  };

  const filteredData = businessList.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Business Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Business Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Business ID',
      dataIndex: 'id',
      key: 'id',
      render: id => <span className="text-blue-500 font-mono">{id.slice(0, 8)}</span>,
    },
    {
      title: 'Details',
      dataIndex: 'id',
      key: 'details',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedBusiness(record);
            setDrawerOpen(true);
          }}
        >
          <InfoCircleOutlined /> View
        </Button>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider width={280} breakpoint="lg" collapsedWidth="0" className="bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <Title level={4} className="text-center">📂 B2B Directory</Title>
        </div>

        <div className="p-4">
          <Input
            placeholder="🔍 Search business"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </Sider>

      {/* Main content */}
      <Layout>
        <Content className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Business Form */}
            <Card
              className="shadow-md"
              title={<Title level={4}><AppstoreAddOutlined /> Register Business</Title>}
            >
              <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item name="name" label="Business Name" rules={[{ required: true }]}>
                  <Input placeholder="e.g. SkyTech" />
                </Form.Item>

                <Form.Item name="type" label="Business Type" rules={[{ required: true }]}>
                  <Select placeholder="Select type">
                    <Option value="e-commerce">E-Commerce</Option>
                    <Option value="gym">Gym</Option>
                    <Option value="retail">Retail</Option>
                    <Option value="salon">Salon</Option>
                    <Option value="restaurant">Restaurant</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="address" label="Full Address" rules={[{ required: true }]}>
                  <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item
                  name="idProof"
                  label="Upload ID Proof"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e.fileList}
                >
                  <Upload beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Upload ID</Button>
                  </Upload>
                </Form.Item>

                <Button type="primary" htmlType="submit" className="bg-sky-500 w-full">
                  ✅ Register
                </Button>
              </Form>
            </Card>

            {/* Right: Business Table */}
            <Card
              className="shadow-md"
              title={<Title level={4}>📋 Registered Businesses</Title>}
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </div>
        </Content>
      </Layout>

      {/* Slide-out drawer for business details */}
      <Drawer
        title="Business Details"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        {selectedBusiness && (
          <div className="space-y-4">
            <p><strong>Name:</strong> {selectedBusiness.name}</p>
            <p><strong>Type:</strong> {selectedBusiness.type}</p>
            <p><strong>Address:</strong><br />{selectedBusiness.address}</p>
            <p><strong>ID:</strong> <span className="text-blue-600 font-mono">{selectedBusiness.id}</span></p>
            {selectedBusiness.idProof?.length > 0 && (
              <div>
                <strong>ID Proof:</strong>
                <ul className="mt-2 list-disc list-inside text-sm text-blue-700">
                  {selectedBusiness.idProof.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </Layout>
  );
}
