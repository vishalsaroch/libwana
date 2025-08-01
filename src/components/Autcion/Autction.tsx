// src

'use client'
import React, { useState, useEffect } from 'react'
import { Card, Typography, Form, InputNumber, Button, message, Statistic, Progress } from 'antd'
const { Title, Text } = Typography

const mockProduct = {
  id: 1,
  name: 'iPhone 14 Pro',
  description: '128GB, Deep Purple',
  startPrice: 200,
  currentBid: 265,
  bidEndTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour later
  escrowType: 'percentage',
  escrowValue: 10 // 10% escrow
}

const AuctionBox = () => {
  const [currentBid, setCurrentBid] = useState(mockProduct.currentBid)
  const [timeLeft, setTimeLeft] = useState(mockProduct.bidEndTime.getTime() - new Date().getTime())
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(mockProduct.bidEndTime.getTime() - new Date().getTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const handlePlaceBid = (values) => {
    setPlacing(true)
    const { bidAmount } = values

    if (bidAmount <= currentBid) {
      message.error('Your bid must be higher than the current bid.')
      setPlacing(false)
      return
    }

    const escrow = mockProduct.escrowType === 'percentage'
      ? (bidAmount * mockProduct.escrowValue) / 100
      : mockProduct.escrowValue

    message.success(`Bid placed successfully! Escrow required: $${escrow.toFixed(2)}`)
    setCurrentBid(bidAmount)
    setPlacing(false)
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Title level={3}>{mockProduct.name}</Title>
      <Text>{mockProduct.description}</Text>
      <Card style={{ marginTop: 24 }}>
        <Statistic title="Current Highest Bid" value={`$${currentBid}`} />
        <Statistic
          title="Time Remaining"
          value={formatTimeLeft(timeLeft)}
          style={{ marginTop: 16 }}
        />
        <Progress percent={Number(((mockProduct.startPrice / currentBid) * 100).toFixed(0))} showInfo={false} style={{ marginTop: 16 }} />
        <Form layout="vertical" onFinish={handlePlaceBid} style={{ marginTop: 24 }}>
          <Form.Item
            label="Your Bid Amount ($)"
            name="bidAmount"
            rules={[{ required: true, message: 'Please enter your bid amount' }]}
          >
            <InputNumber min={currentBid + 1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={placing}>
              Place Bid
            </Button>
          </Form.Item>
        </Form>
        <Text type="secondary">
          Escrow: {mockProduct.escrowType === 'percentage' ? `${mockProduct.escrowValue}%` : `$${mockProduct.escrowValue}`} (non-refundable if bid is placed)
        </Text>
      </Card>
    </div>
  )
}

export default AuctionBox
