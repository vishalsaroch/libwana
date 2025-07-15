'use client';
import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { MdDownload, MdPrint, MdQrCode2 } from 'react-icons/md';
import { BsWhatsapp, BsFacebook, BsTwitter } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { userSignUpData } from '@/redux/reuducer/authSlice';
import { t } from '@/utils';

import {
  Card,
  Typography,
  Row,
  Col,
  Select,
  Checkbox,
  Button,
  Divider,
  Space,
  message,
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const QRCodeManager = () => {
  const userData = useSelector(userSignUpData);
  const [qrSize, setQrSize] = useState(256);
  const [includeBusinessInfo, setIncludeBusinessInfo] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef(null);

  const businessUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/seller/${userData?.id}`;

  const downloadQRCode = async (format = 'png') => {
    if (!qrRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${userData?.name || 'business'}-qr-code.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
      message.error('Failed to download QR code');
    } finally {
      setIsDownloading(false);
    }
  };

  const printQRCode = () => {
    if (!qrRef.current) return;
    const printWindow = window.open('', '_blank');
    const qrContent = qrRef.current.outerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${userData?.name}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; text-align: center; }
            .qr-container {
              display: inline-block;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">${qrContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const shareQRCode = async (platform) => {
    const shareText = `Visit ${userData?.name}'s business page`;
    const shareData = {
      title: `${userData?.name} - Business Page`,
      text: shareText,
      url: businessUrl,
    };

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${businessUrl}`)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(businessUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(businessUrl)}`);
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          navigator.clipboard.writeText(businessUrl);
          message.success('Link copied to clipboard!');
        }
    }
  };

  return (
    <Card className="shadow-md" bordered>
      <Row gutter={[24, 24]}>
        {/* Header */}
        <Col span={24}>
          <Space align="center">
            <MdQrCode2 size={24} style={{ color: '#1890ff' }} />
            <Title level={3} style={{ marginBottom: 0 }}>
              {t('qrCodeManager') || 'QR Code Manager'}
            </Title>
          </Space>
        </Col>

        {/* QR Code Preview */}
        <Col xs={24} lg={12}>
          <Card title={t('qrCodePreview') || 'QR Code Preview'} bordered>
            <div ref={qrRef} style={{ textAlign: 'center' }}>
              {includeBusinessInfo && (
                <>
                  <Title level={4}>{userData?.name}</Title>
                  <Text type="secondary">{t('scanToVisitBusinessPage') || 'Scan to visit our business page'}</Text>
                  <Divider />
                </>
              )}
              <QRCode
                value={businessUrl}
                size={qrSize}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />
              {includeBusinessInfo && (
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">{t('businessPage') || 'Business Page'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{businessUrl}</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Controls */}
        <Col xs={24} lg={12}>
          <Card title={t('customization') || 'Customization'} bordered>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>{t('qrCodeSize') || 'QR Code Size'}</Text>
                <Select
                  value={qrSize}
                  onChange={(value) => setQrSize(value)}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <Option value={128}>Small (128x128)</Option>
                  <Option value={256}>Medium (256x256)</Option>
                  <Option value={512}>Large (512x512)</Option>
                </Select>
              </div>

              <Checkbox
                checked={includeBusinessInfo}
                onChange={(e) => setIncludeBusinessInfo(e.target.checked)}
              >
                {t('includeBusinessInfo') || 'Include business information'}
              </Checkbox>

              <Divider orientation="left">{t('actions') || 'Actions'}</Divider>

              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    type="primary"
                    icon={<MdDownload />}
                    block
                    loading={isDownloading}
                    onClick={() => downloadQRCode('png')}
                  >
                    PNG
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    icon={<MdDownload />}
                    block
                    loading={isDownloading}
                    onClick={() => downloadQRCode('jpeg')}
                  >
                    JPEG
                  </Button>
                </Col>
              </Row>

              <Button
                icon={<MdPrint />}
                block
                onClick={printQRCode}
              >
                {t('print') || 'Print'}
              </Button>

              <Divider orientation="left">{t('shareOn') || 'Share on:'}</Divider>

              <Row gutter={12}>
                <Col span={8}>
                  <Button
                    block
                    icon={<BsWhatsapp />}
                    style={{ background: '#25D366', color: '#fff' }}
                    onClick={() => shareQRCode('whatsapp')}
                  >
                    WhatsApp
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    block
                    icon={<BsFacebook />}
                    style={{ background: '#1877F2', color: '#fff' }}
                    onClick={() => shareQRCode('facebook')}
                  >
                    Facebook
                  </Button>
                </Col>
                <Col span={8}>
                  <Button
                    block
                    icon={<BsTwitter />}
                    style={{ background: '#1DA1F2', color: '#fff' }}
                    onClick={() => shareQRCode('twitter')}
                  >
                    Twitter
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* Marketing Tips */}
        <Col span={24}>
          <Card
            title={t('marketingTips') || 'Marketing Tips:'}
            style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}
          >
            <ul style={{ paddingLeft: 16, lineHeight: 1.8 }}>
              <li>{t('tipPoster') || 'Print this QR code on posters and display at your physical location'}</li>
              <li>{t('tipBusinessCards') || 'Add to business cards for easy digital connection'}</li>
              <li>{t('tipSocialMedia') || 'Share on social media to drive online traffic'}</li>
              <li>{t('tipFlyers') || 'Include in flyers and promotional materials'}</li>
              <li>{t('tipEmail') || 'Add to email signatures for professional networking'}</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default QRCodeManager;