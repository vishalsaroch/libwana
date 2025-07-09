'use client'
import React, { useState, useEffect } from 'react'
import { FaUser, FaEye, FaPhone, FaEnvelope } from 'react-icons/fa'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import { serviceInteractionApi } from '@/utils/api'
import { t } from '@/utils'
import Image from 'next/image'
import { placeholderImage } from '@/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

const InterestedUsers = ({ productData, systemSettingsData }) => {
    const [interestedUsers, setInterestedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (productData?.id) {
            fetchInterestedUsers()
        }
    }, [productData?.id])

    const fetchInterestedUsers = async (page = 1) => {
        try {
            setIsLoading(true)
            const response = await serviceInteractionApi.getInterestedUsers({
                item_id: productData?.id,
                page
            })
            
            if (response?.data?.error === false) {
                const newUsers = response?.data?.data?.data || []
                if (page === 1) {
                    setInterestedUsers(newUsers)
                } else {
                    setInterestedUsers(prev => [...prev, ...newUsers])
                }
                setHasMore(response?.data?.data?.current_page < response?.data?.data?.last_page)
            }
        } catch (error) {
            console.error('Error fetching interested users:', error)
            toast.error(t('errorFetchingInterestedUsers'))
        } finally {
            setIsLoading(false)
        }
    }

    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchInterestedUsers(nextPage)
        }
    }

    const handleContactUser = (user) => {
        if (user?.mobile) {
            window.open(`tel:${user.mobile}`, '_self')
        } else {
            toast.error(t('contactDetailsNotAvailable'))
        }
    }

    const handleEmailUser = (user) => {
        if (user?.email) {
            window.open(`mailto:${user.email}`, '_blank')
        } else {
            toast.error(t('emailNotAvailable'))
        }
    }

    if (!productData?.interest_count || productData?.interest_count === 0) {
        return null
    }

    return (
        <>
            <div className="interested_users_card card">
                <div className="card-header">
                    <span>{t('interestedUsers')} ({productData?.interest_count})</span>
                    <button 
                        className="view_all_btn"
                        onClick={() => setShowModal(true)}
                    >
                        {t('viewAll')}
                    </button>
                </div>
                <div className="card-body">
                    <div className="interested_users_preview">
                        {interestedUsers.slice(0, 3).map((user, index) => (
                            <div key={user.id} className="interested_user_item">
                                <Image
                                    src={user?.profile || systemSettingsData?.data?.data?.placeholder_image}
                                    alt={user?.name}
                                    width={40}
                                    height={40}
                                    className="user_avatar"
                                    onErrorCapture={placeholderImage}
                                />
                                <div className="user_info">
                                    <span className="user_name">{user?.name}</span>
                                    <span className="interested_time">
                                        {new Date(user?.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="user_actions">
                                    <button 
                                        className="contact_btn"
                                        onClick={() => handleContactUser(user)}
                                        title={t('contact')}
                                    >
                                        <FaPhone size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {productData?.interest_count > 3 && (
                            <div className="more_users_indicator">
                                +{productData?.interest_count - 3} {t('more')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for viewing all interested users */}
            {showModal && (
                <div className="interested_users_modal">
                    <div className="modal_overlay" onClick={() => setShowModal(false)} />
                    <div className="modal_content">
                        <div className="modal_header">
                            <h3>{t('interestedUsers')}</h3>
                            <button 
                                className="close_btn"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal_body">
                            {interestedUsers.map((user, index) => (
                                <div key={user.id} className="interested_user_detail">
                                    <Link href={`/user/${user.id}`} className="user_profile_link">
                                        <Image
                                            src={user?.profile || systemSettingsData?.data?.data?.placeholder_image}
                                            alt={user?.name}
                                            width={50}
                                            height={50}
                                            className="user_avatar_large"
                                            onErrorCapture={placeholderImage}
                                        />
                                        <div className="user_details">
                                            <span className="user_name">{user?.name}</span>
                                            <span className="user_email">{user?.email}</span>
                                            <span className="interested_time">
                                                {t('interestedOn')}: {new Date(user?.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="user_action_buttons">
                                        <button 
                                            className="action_btn contact_btn"
                                            onClick={() => handleContactUser(user)}
                                            title={t('contact')}
                                        >
                                            <FaPhone size={16} />
                                        </button>
                                        <button 
                                            className="action_btn email_btn"
                                            onClick={() => handleEmailUser(user)}
                                            title={t('email')}
                                        >
                                            <FaEnvelope size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {hasMore && (
                                <button 
                                    className="load_more_btn"
                                    onClick={loadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('loading') : t('loadMore')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default InterestedUsers
