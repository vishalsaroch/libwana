'use client'
import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { MdDownload, MdQrCode2, MdClose } from 'react-icons/md';
import { BsShare } from 'react-icons/bs';
import { t } from '@/utils';

const BusinessQRCode = ({ seller, currentUrl }) => {
    const [showQRModal, setShowQRModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const qrRef = useRef(null);

    const downloadQRCode = async () => {
        if (!qrRef.current) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(qrRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true
            });
            
            const link = document.createElement('a');
            link.download = `${seller?.name || 'business'}-qr-code.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Error downloading QR code:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const shareQRCode = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${seller?.name} - Business Page`,
                    text: `Visit ${seller?.name}'s business page`,
                    url: currentUrl
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(currentUrl);
                alert('Link copied to clipboard!');
            } catch (error) {
                console.error('Error copying to clipboard:', error);
            }
        }
    };

    return (
        <>
            {/* QR Code Button */}
            <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
                <MdQrCode2 size={20} />
                <span className="text-sm font-medium">{t('qrCode') || 'QR Code'}</span>
            </button>

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {seller?.name} - QR Code
                            </h3>
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* QR Code Content */}
                        <div className="p-6">
                            <div 
                                ref={qrRef}
                                className="flex flex-col items-center bg-white p-6 rounded-lg"
                            >
                                {/* Business Info */}
                                <div className="text-center mb-4">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                                        {seller?.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {t('scanToVisitBusinessPage') || 'Scan to visit business page'}
                                    </p>
                                </div>

                                {/* QR Code */}
                                <div className="p-4 bg-white rounded-lg shadow-sm border">
                                    <QRCode
                                        value={currentUrl}
                                        size={200}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox="0 0 256 256"
                                    />
                                </div>

                                {/* Business Details */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500 mb-2">
                                        {t('businessPage') || 'Business Page'}
                                    </p>
                                    <p className="text-xs text-gray-400 break-all">
                                        {currentUrl}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={downloadQRCode}
                                    disabled={isDownloading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    <MdDownload size={20} />
                                    <span className="font-medium">
                                        {isDownloading ? (t('downloading') || 'Downloading...') : (t('download') || 'Download')}
                                    </span>
                                </button>

                                <button
                                    onClick={shareQRCode}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <BsShare size={18} />
                                    <span className="font-medium">{t('share') || 'Share'}</span>
                                </button>
                            </div>

                            {/* Usage Instructions */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-2">
                                    {t('howToUse') || 'How to use:'}
                                </h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• {t('printQRCode') || 'Print this QR code on posters, flyers, or business cards'}</li>
                                    <li>• {t('shareDigitally') || 'Share digitally on social media or websites'}</li>
                                    <li>• {t('customersCanScan') || 'Customers can scan to visit your business page directly'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BusinessQRCode;
