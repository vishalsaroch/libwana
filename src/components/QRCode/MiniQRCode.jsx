'use client';
import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Button, Modal, Typography, Space } from 'antd';
import { MdQrCode2, MdDownload } from 'react-icons/md';
import { t } from '@/utils';

const { Text, Title } = Typography;

const MiniQRCode = ({ businessName, businessUrl, className = "" }) => {
  const [visible, setVisible] = useState(false);
  const qrRef = useRef(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${businessName || 'business'}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        icon={<MdQrCode2 size={16} />}
        shape="circle"
        type="primary"
        onClick={() => setVisible(true)}
        title={t('viewQRCode') || 'View QR Code'}
        className={className}
      />

      {/* Ant Design Modal */}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        centered
        title={<Title level={5} style={{ margin: 0 }}>{businessName}</Title>}
      >
        <div className="flex flex-col items-center justify-center space-y-4 mt-4">
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-lg border shadow-sm inline-block"
          >
            <QRCode
              value={businessUrl}
              size={150}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>
          <Text type="secondary" className="text-center">
            {t('scanToVisitBusinessPage') || 'Scan to visit business page'}
          </Text>

          <Button
            icon={<MdDownload size={16} />}
            type="primary"
            onClick={handleDownload}
            block
          >
            {t('downloadQRCode') || 'Download QR Code'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MiniQRCode;
