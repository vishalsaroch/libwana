'use client'
import React, { useState } from 'react'
import { FaThumbsUp, FaPhone, FaQuestionCircle } from 'react-icons/fa'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import { MdAvailableForHire } from 'react-icons/md'
import { isLogin, t } from '@/utils'
import { serviceInteractionApi } from '@/utils/api'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import { userSignUpData } from '@/redux/reuducer/authSlice'
import './ServiceInteractionButtons.css'

const ServiceInteractionButtons = ({ 
    productData, 
    systemSettingsData, 
    onContactClick, 
    onChatClick 
}) => {
    const [isInterested, setIsInterested] = useState(productData?.is_interested || false)
    const [isLoading, setIsLoading] = useState(false)
    const [interestCount, setInterestCount] = useState(productData?.interest_count || 0)
    const [buttonStates, setButtonStates] = useState({
        interested: false,
        availability: false,
        contact: false,
        chat: false
    })
    const loggedInUser = useSelector(userSignUpData)
    
    const handleInterested = async () => {
        if (!isLogin()) {
            Swal.fire({
                icon: "error",
                title: t('oops'),
                text: t("loginToShowInterest"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            })
            return
        }

        if (productData?.user_id === loggedInUser?.id) {
            toast.error(t('cannotInteractWithOwnListing'))
            return
        }

        try {
            setIsLoading(true)
            setButtonStates(prev => ({ ...prev, interested: true }))
            
            const response = await serviceInteractionApi.toggleInterest({
                item_id: productData?.id
            })
            
            if (response?.data?.error === false) {
                setIsInterested(!isInterested)
                setInterestCount(prev => isInterested ? prev - 1 : prev + 1)
                toast.success(response?.data?.message || t(isInterested ? 'interestRemoved' : 'interestMarked'))
                
                // Add pulse animation
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
            setButtonStates(prev => ({ ...prev, interested: false }))
        }
    }

    const handleAvailabilityCheck = async () => {
        if (!isLogin()) {
            Swal.fire({
                icon: "error",
                title: t('oops'),
                text: t("loginToCheckAvailability"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            })
            return
        }

        if (productData?.user_id === loggedInUser?.id) {
            toast.error(t('cannotInteractWithOwnListing'))
            return
        }

        try {
            setIsLoading(true)
            setButtonStates(prev => ({ ...prev, availability: true }))
            
            const response = await serviceInteractionApi.checkAvailability({
                item_id: productData?.id
            })
            
            if (response?.data?.error === false) {
                // This will typically trigger a notification to the seller
                toast.success(response?.data?.message || t('availabilityInquirySent'))
                
                // Add success animation
                const button = document.querySelector('.availability_btn')
                if (button) {
                    button.classList.add('success')
                    setTimeout(() => button.classList.remove('success'), 2000)
                }
                
                // Optionally start a chat with predefined message
                if (onChatClick) {
                    setTimeout(() => {
                        onChatClick('Is this service still available?')
                    }, 1000)
                }
            } else {
                toast.error(response?.data?.message || t('somethingWentWrong'))
            }
        } catch (error) {
            console.error('Error checking availability:', error)
            toast.error(t('somethingWentWrong'))
        } finally {
            setIsLoading(false)
            setButtonStates(prev => ({ ...prev, availability: false }))
        }
    }

    const handleContactProvider = () => {
        if (!isLogin()) {
            Swal.fire({
                icon: "error",
                title: t('oops'),
                text: t("loginToContactProvider"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            })
            return
        }

        if (productData?.user_id === loggedInUser?.id) {
            toast.error(t('cannotInteractWithOwnListing'))
            return
        }

        setButtonStates(prev => ({ ...prev, contact: true }))
        
        if (onContactClick) {
            onContactClick()
        }
        
        // Reset button state after animation
        setTimeout(() => {
            setButtonStates(prev => ({ ...prev, contact: false }))
        }, 500)
    }

    const handleStartChat = () => {
        if (!isLogin()) {
            Swal.fire({
                icon: "error",
                title: t('oops'),
                text: t("loginToStartChat"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            })
            return
        }

        if (productData?.user_id === loggedInUser?.id) {
            toast.error(t('cannotInteractWithOwnListing'))
            return
        }

        setButtonStates(prev => ({ ...prev, chat: true }))
        
        if (onChatClick) {
            onChatClick()
        }
        
        // Reset button state after animation
        setTimeout(() => {
            setButtonStates(prev => ({ ...prev, chat: false }))
        }, 500)
    }

    // Don't show interaction buttons if user is viewing their own listing
    if (isLogin() && productData?.user_id === loggedInUser?.id) {
        return null
    }

    return (
    <div>
    </div>
    )
}

export default ServiceInteractionButtons
