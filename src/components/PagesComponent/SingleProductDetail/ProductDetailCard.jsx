'use client'
import ReactShare from "@/components/SEO/ReactShare"
import { formatPriceAbbreviated, isLogin, t } from "@/utils";
import { manageFavouriteApi } from "@/utils/api";
import { Dropdown } from "antd";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaHeart, FaRegCalendarCheck, FaRegHeart } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useState, useEffect } from 'react';




const ProductDetailCard = ({ productData, setProductData, systemSettingsData }) => {

 const [timeLeft, setTimeLeft] = useState('');
const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
  const end = new Date(productData.end_time);
  const interval = setInterval(() => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) {
      setTimeLeft('Auction Ended');
      clearInterval(interval);
    } else {
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    }
  }, 1000);
  return () => clearInterval(interval);
}, [productData?.end_time]);



const handleBid = (e) => {
  e.preventDefault();
  console.log('Placing bid:', bidAmount);
};

    const path = usePathname()
    const CompanyName = systemSettingsData?.data?.data?.company_name
    const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}${path}`;
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl + "?share=true");
            toast.success(t("copyToClipboard"));
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };


    const handleLikeItem = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLogin()) {
            Swal.fire({
                icon: "error",
                title: t('oops'),
                text: t("loginToAddOrRemove"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            })
            return
        }
        try {
            const response = await manageFavouriteApi.manageFavouriteApi({ item_id: productData?.id })
            if (response?.data?.error === false) {
                setProductData((prev) => ({ ...prev, is_liked: !productData?.is_liked }))
            }
            toast.success(response?.data?.message)
        } catch (error) {
            console.log(error)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const formattedDate = productData?.created_at ? formatDate(productData.created_at) : '';


    return (
        <div className="product card">
            <div className="card-body">
                <div className="product_div">
                    <div className="title_and_price">
                        <span className='title'>
                            {productData?.name}
                        </span>
                        <div className="price">
                            <span>{CurrencySymbol}</span>
                            <span>{formatPriceAbbreviated(productData?.price)}</span>
                        </div>
                    </div>
                    <div className="like_share">
                        {productData?.is_liked === true ? (
                            <button className="isLiked" onClick={handleLikeItem}><FaHeart size={20} /></button>

                        ) : (
                            <button onClick={handleLikeItem}><FaRegHeart size={20} /></button>
                        )}

                        <Dropdown overlay={<ReactShare currentUrl={currentUrl} handleCopyUrl={handleCopyUrl} data={productData?.name} CompanyName={CompanyName} />} placement="bottomRight" arrow>
                            <button><FiShare2 size={20} /></button>
                        </Dropdown>
                    </div>
                </div>
                <div className="product_id">
                    <FaRegCalendarCheck size={16} />
                    <span> {t('postedOn')}: {formattedDate} </span>
                </div>

                 {productData?.delivery_available !== undefined && (
      <div className="delivery_info">
        <strong>Delivery Available:</strong> {productData.delivery_available ? 'Yes' : 'No'}
      </div>
    )}
      {productData?.start_price && (
  <div className="auction-box">
    <h3>🔔 Auction Live</h3>
    <p><strong>Start Price:</strong> ₹{productData.start_price}</p>
    <p><strong>Ends In:</strong> {timeLeft}</p>

    <form onSubmit={handleBid}>
      <input
        type="number"
        placeholder="Enter your bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        required
      />
      <button type="submit">Place Bid</button>
    </form>
  </div>
)}

            </div>

        </div>
    )
}

export default ProductDetailCard