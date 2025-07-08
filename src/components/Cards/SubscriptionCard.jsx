'use client'
import { FaArrowRight, FaCheck } from 'react-icons/fa6'
import Image from 'next/image'
import { formatPriceAbbreviated, placeholderImage, t } from '@/utils'
import { useSelector } from 'react-redux'
import { Card, Button, Row, Col, Tag, Typography, Space, Divider, Grid } from 'antd'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const SubscriptionCard = ({ data, handlePurchasePackage }) => {
    const descriptionItems = data?.description ? data.description.split('\r\n') : [];
    const systemSettingsData = useSelector((state) => state?.Settings)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    const screens = useBreakpoint();

    return (
        <Card
            className={`subscription-card ${data.is_active ? 'active_card' : ""}`}
            hoverable
            style={{
                maxWidth: 400,
                margin: 'auto',
                border: data.is_active ? '2px solid #1677ff' : '1px solid #f0f0f0',
                borderRadius: 20,
                boxShadow: data.is_active ? '0 4px 24px #1677ff22' : '0 2px 8px #00000010',
                background: data.is_active ? '#f0f7ff' : '#fff',
                transition: 'all 0.3s',
                minHeight: 420,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            bodyStyle={{ padding: screens.xs ? 16 : 32 }}
        >
            <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
                <Col flex="80px">
                    <Image
                        src={data?.icon}
                        alt={data?.name}
                        width={80}
                        height={80}
                        className='sub_icon'
                        style={{ borderRadius: 16, background: '#fafafa', objectFit: 'contain' }}
                        onErrorCapture={placeholderImage}
                    />
                </Col>
                <Col flex="auto">
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 0 }}>{data?.name}</Title>
                        <Space align="baseline" wrap>
                            {data?.final_price !== 0 ? (
                                <Text strong style={{ fontSize: 24 }}>
                                    <span style={{ color: '#1677ff' }}>{CurrencySymbol}</span>
                                    {formatPriceAbbreviated(data?.final_price)}
                                </Text>
                            ) : (
                                <Tag color="green" style={{ fontSize: 18, padding: '2px 12px' }}>Free</Tag>
                            )}
                            {data?.price > data?.final_price && (
                                <Text delete type="secondary" style={{ marginLeft: 8 }}>
                                    {CurrencySymbol}{formatPriceAbbreviated(data?.price)}
                                </Text>
                            )}
                        </Space>
                        {!data.is_active && data?.discount_in_percentage !== 0 && (
                            <Tag color="red">{t('off')} {data?.discount_in_percentage}%</Tag>
                        )}
                    </Space>
                </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <div>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Space>
                        <FaCheck size={18} style={{ color: '#52c41a' }} />
                        <Text>{data?.item_limit} {t('adsListing')}</Text>
                    </Space>
                    <Space>
                        <FaCheck size={18} style={{ color: '#52c41a' }} />
                        <Text>
                            {data?.duration !== "unlimited"
                                ? `${data?.duration} ${t('days')}`
                                : `${data?.duration} ${t('days')}`}
                        </Text>
                    </Space>
                    {descriptionItems.map((item, index) => (
                        <Space key={index}>
                            <FaCheck size={18} style={{ color: '#52c41a' }} />
                            <Text>{item}</Text>
                        </Space>
                    ))}
                </Space>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Button
                    type="primary"
                    size="large"
                    icon={<FaArrowRight />}
                    onClick={(e) => handlePurchasePackage(e, data)}
                    disabled={data.is_active}
                    style={{
                        width: '100%',
                        visibility: data.is_active ? 'hidden' : 'visible',
                        borderRadius: 8,
                        fontWeight: 600,
                        letterSpacing: 1,
                    }}
                >
                    {t('choosePlan')}
                </Button>
            </div>
        </Card>
    )
}

export default SubscriptionCard