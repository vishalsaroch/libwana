'use client'
import React, { useEffect, useState } from 'react'
import { List, Card, InputNumber, Button, Form, message, Typography } from 'antd'
const { Title, Text } = Typography

const mockBids = [
  { id: 1, product_name: 'Vintage Clock', amount: 1200, is_winning: false },
  { id: 2, product_name: 'Antique Vase', amount: 2500, is_winning: true },
]

const MyBids = () => {
  const [bids, setBids] = useState([])
  const [placing, setPlacing] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    // Static API mock
    setBids(mockBids)
  }, [])

  const handlePlaceBid = (values) => {
    setPlacing(true)
    const { productId, bidAmount, autoIncrement = 0, autoMax = 0 } = values

    // Simulate bid placement
    setTimeout(() => {
      setBids((prev) => {
        const exists = prev.find(b => b.id === productId)
        if (exists) {
          return prev.map((bid) => {
            if (bid.id === productId) {
              const increased = bidAmount > bid.amount ? bidAmount : bid.amount
              return { ...bid, amount: increased, is_winning: true }
            }
            return bid
          })
        } else {
          // Add new bid entry
          return [
            ...prev,
            { id: productId, product_name: `Item #${productId}`, amount: bidAmount, is_winning: true }
          ]
        }
      })
      message.success('Your bid was placed successfully! You will be notified on win.')
      setPlacing(false)
      form.resetFields()
    }, 1000)
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>My Auction Bids</Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={bids}
        renderItem={bid => (
          <List.Item>
            <Card title={bid.product_name} bordered>
              <Text><strong>Your Bid:</strong> ₹{bid.amount}</Text><br/>
              <Text><strong>Status:</strong> {bid.is_winning ? '✅ Winning' : '❌ Outbid'}</Text>
            </Card>
          </List.Item>
        )}
      />

      <Card title="Place a New Bid" style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePlaceBid}
          initialValues={{ autoIncrement: 50 }}
        >
          <Form.Item
            name="productId"
            label="Product ID"
            rules={[{ required: true, message: 'Select a product to bid on' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter product ID (e.g. 1 or 2)"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="bidAmount"
            label="Bid Amount (₹)"
            rules={[{ required: true, message: 'Enter your bid amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter amount"
              min={1}
            />
          </Form.Item>

          <Form.Item label="Auto-bid Settings">
            <Form.Item name="autoIncrement" noStyle>
              <InputNumber
                placeholder="Increment Step"
                min={1}
                style={{ width: '48%', marginRight: '4%' }}
              />
            </Form.Item>
            <Form.Item name="autoMax" noStyle>
              <InputNumber
                placeholder="Maximum Bid"
                min={1}
                style={{ width: '48%' }}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={placing}>
              Place Bid
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          Note: Highest bidder wins if minimum threshold is reached. You will have 48 hours to complete payment and delivery after winning.
        </Text>
      </Card>
    </div>
  )
}

export default MyBids
