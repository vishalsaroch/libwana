'use client'
import React, { useState } from 'react'
import { FaThumbsUp } from 'react-icons/fa'
import { isLogin, t } from '@/utils'
import { serviceInteractionApi } from '@/utils/api'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import { userSignUpData } from '@/redux/reuducer/authSlice'
import './ServiceInteractionButtons.css'

const ServiceInteractionButtons = ({ productData }) => {
    const [isInterested, setIsInterested] = useState(productData?.is_interested || false)
    const [isLoading, setIsLoading] = useState(false)
    const [interestCount, setInterestCount] = useState(productData?.interest_count || 0)
    const loggedInUser = useSelector(userSignUpData)

    const handleInterested = async () => {
        if (!isLogin()) {
            Swal.fire({
                icon: "error",
                title: t('oops'),
                text: t("loginToShowInterest"),
                allowOutsideClick: false,
                customClass: { confirmButton: 'Swal-confirm-buttons' },
            })
            return
        }

        if (productData?.user_id === loggedInUser?.id) {
            toast.error(t('cannotInteractWithOwnListing'))
            return
        }

        try {
            setIsLoading(true)

            const response = await serviceInteractionApi.toggleInterest({
                item_id: productData?.id
            })

            if (response?.data?.error === false) {
                setIsInterested(!isInterested)
                setInterestCount(prev => isInterested ? prev - 1 : prev + 1)
                toast.success(response?.data?.message || t(isInterested ? 'interestRemoved' : 'interestMarked'))

                // Pulse effect
                const button = document.querySelector('.interaction_btn.interested')
                if (button) {
                    button.classList.add('pulse')
                    setTimeout(() => button.classList.remove('pulse'), 500)
                }
            } else {
                toast.error(response?.data?.message || t('somethingWentWrong'))
            }
        } catch (error) {
            console.error('Error toggling interest:', error)
            toast.error(t('somethingWentWrong'))
        } finally {
            setIsLoading(false)
        }
    }

    // Don't show buttons on own listing
    if (isLogin() && productData?.user_id === loggedInUser?.id) {
        return null
    }

    return (
        <div className="service_interaction_buttons card">
            <div className="card-header">
                <span>{t('serviceInteraction')}</span>
            </div>
            <div className="card-body">
                <div className="interaction_buttons_grid" style={{ gridTemplateColumns: '1fr' }}>
                    <button
                        className={`interaction_btn ${isInterested ? 'interested' : ''}`}
                        onClick={handleInterested}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        <FaThumbsUp size={18} />
                        <span>{t('interested')}</span>
                        {interestCount > 0 && (
                            <span className="interaction_count">{interestCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceInteractionButtons
