import React from 'react';
import { Modal } from 'antd';
import { MdWarning, MdClose } from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';
import { t } from '@/utils';

const VpnWarning = ({ isVisible, onClose, clientIP, isVpn }) => {
    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>;

    return (
        <Modal
            centered
            open={isVisible}
            closeIcon={CloseIcon}
            colorIconHover="transparent"
            className="ant_vpn_warning_modal"
            onCancel={onClose}
            footer={null}
            maskClosable={false}
        >
            <div className="vpn_warning_modal">
                <div className="vpn_warning_header">
                    <div className="vpn_warning_icon">
                        <FaShieldAlt size={48} color="#ff4d4f" />
                    </div>
                    <h1 className="vpn_warning_title">
                        {t('vpnDetectedError')}
                    </h1>
                </div>

                <div className="vpn_warning_content">
                    <div className="vpn_warning_message">
                        <MdWarning size={24} color="#faad14" />
                        <p>{t('vpnNotAllowed')}</p>
                    </div>
                    
                    <div className="vpn_warning_details">
                        <p><strong>{t('securityCompliance')}</strong></p>
                        <ul>
                            <li>• Security and fraud prevention</li>
                            <li>• Regional compliance requirements</li>
                            <li>• User verification policies</li>
                            <li>• Data protection measures</li>
                        </ul>
                    </div>

                    {clientIP && (
                        <div className="vpn_warning_ip_info">
                            <p><strong>IP Address:</strong> {clientIP}</p>
                            <p><strong>Status:</strong> {isVpn ? 'VPN/Proxy Detected' : 'Clean'}</p>
                        </div>
                    )}
                </div>

                <div className="vpn_warning_actions">
                    <h3>What can you do?</h3>
                    <ol>
                        <li>Disable your VPN or proxy connection</li>
                        <li>Switch to a different network</li>
                        <li>Contact support if you believe this is an error</li>
                    </ol>
                </div>

                <div className="vpn_warning_footer">
                    <button 
                        className="vpn_warning_btn"
                        onClick={onClose}
                    >
                        {t('understood')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default VpnWarning;
