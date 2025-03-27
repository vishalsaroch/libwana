'use client'
import Image from 'next/image'
import { placeholderImage, t } from '@/utils'

const UserBuyerChatTab = ({ isActive, chat, handleChatTabClick }) => {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);

        if (diffInSeconds < 60) {
            return t('now');
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays === 1) {
            return t('yesterday');
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else if (diffInWeeks < 4) {
            return `${diffInWeeks}w ago`;
        } else if (diffInMonths < 12) {
            return `${diffInMonths}mo ago`;
        } else {
            return `${diffInYears}y ago`;
        }
    };


    return (
        <div className="chat_user_tab_wrapper" onClick={() => handleChatTabClick(chat)}>
            <div className={`chat_user_tab ${isActive && 'chat_user_tab_active'}`}>
                <div className="user_name_img">
                    <div className="user_chat_tab_img_cont">
                        <Image src={chat?.seller?.profile ? chat?.seller?.profile : placeholderImage} alt="User" width={56} height={56} className="user_chat_tab_img" onErrorCapture={placeholderImage} />
                        <Image src={chat?.item?.image ? chat?.item?.image : placeholderImage} alt="User" width={24} height={24} className="user_chat_small_img" onErrorCapture={placeholderImage} />
                    </div>
                    <div className="user_det">
                        <h6 title={chat?.seller?.name}>{chat?.seller?.name}</h6>
                        <span className='reviewItemName'>{chat?.item?.name}</span>
                    </div>
                </div>
                {
                    chat?.last_message_time &&
                    <p className="user_chat_tab_time">{formatTime(chat?.last_message_time)}</p>
                }
            </div>
        </div>
    )
}

export default UserBuyerChatTab