//src/components/Cards/ProductCard.jsx

'use client'
import Image from "next/image"
import { FaRegHeart } from "react-icons/fa";
import { formatDate, formatPriceAbbreviated, placeholderImage, t } from "@/utils";
import { BiBadgeCheck } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";
import { manageFavouriteApi } from "@/utils/api";
import toast from "react-hot-toast";
import { userSignUpData } from '../../redux/reuducer/authSlice';
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ServiceInteractionButtons from "@/components/ServiceInteraction/ServiceInteractionButtons";
import { useRouter } from "next/navigation";
import { saveOfferData } from "@/redux/reuducer/offerSlice";
import { itemOfferApi } from "@/utils/api";
import { useDispatch } from "react-redux";
import { addToCompare, removeFromCompare, selectCompareList } from "@/redux/reuducer/compareSlice";
// import MiniQRCode from "@/components/QRCode/MiniQRCode";




const ProductCard = ({ data, handleLike }) => {
    const userData = useSelector(userSignUpData)
    const systemSettingsData = useSelector((state) => state?.Settings)
    const compareList = useSelector(selectCompareList)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    const router = useRouter()
    const dispatch = useDispatch()


    const handleLikeItem = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        try {
            if (!userData) {
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
            const response = await manageFavouriteApi.manageFavouriteApi({ item_id: data?.id })
            if (response?.data?.error === false) {
                toast.success(response?.data?.message)
                handleLike(data?.id)
            }
            else {
                toast.success(t('failedToLike'))
            }

        } catch (error) {
            console.log(error)
            toast.success(t('failedToLike'))
        }
    }

    // Handle chat with predefined message
    const handleChatClick = async (predefinedMessage = null) => {
        if (!data?.is_already_offered) {
            try {
                const response = await itemOfferApi.offer({
                    item_id: data.id,
                });
                const { data: offerData } = response.data;
                dispatch(saveOfferData(offerData));
            } catch (error) {
                toast.error(t('unableToStartChat'));
                console.log(error);
                return;
            }
        } else {
            const offer = data.item_offers?.find((item) => userData?.id === item?.buyer_id)
            const offerAmount = offer?.amount
            const offerId = offer?.id

            const selectedChat = {
                amount: offerAmount,
                id: offerId,
                item: {
                    status: data?.status,
                    price: data?.price,
                    image: data?.image,
                    name: data?.name,
                    review: null,
                },
                user_blocked: false,
                item_id: data?.id,
                seller: {
                    profile: data?.user?.profile,
                    name: data?.user?.name,
                    id: data?.user?.id,
                },
                tab: 'buying',
                predefinedMessage
            }
            dispatch(saveOfferData(selectedChat))
        }
        router.push('/chat');
    }

    // Handle contact provider
    const handleContactClick = () => {
        if (data?.user?.show_personal_details === 1 && data?.user?.mobile) {
            window.open(`tel:${data?.user?.mobile}`, '_self');
        } else {
            toast.error(t('contactDetailsNotAvailable'));
        }
    }

    // Handle compare toggle
    const handleCompareToggle = () => {
        const isInCompare = compareList.some(item => item.id === data.id);
        if (isInCompare) {
            dispatch(removeFromCompare(data.id));
        } else {
            dispatch(addToCompare(data));
            // Check if after adding this item, we have 2 or more items
            // We check for 1 because the state update is async, so current compareList.length + 1 = 2
            if (compareList.length === 1) {
                // Redirect to compare page after a small delay to allow state update
                setTimeout(() => {
                    router.push('/compare');
                }, 100);
            }
        }
    }


    return (
        <div className="product_card">
            <div className="position-relative">
                <Image src={data?.image} width={220} height={190} alt="Product" className="product_card_prod_img" onErrorCapture={placeholderImage} />
                {data?.is_feature ? (
                    <div className="product_card_featured_cont">
                        <BiBadgeCheck size={16} color="white" />
                        <p className="product_card_featured">{t('featured')}</p>
                    </div>
                ) : null}

                <div className="product_card_black_heart_cont" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLikeItem(e);
                }}>
                    {data?.is_liked ? (
                        <button className="isLiked">
                            <FaHeart size={24} className="like_icon" />
                        </button>
                    ) : (

                        <button>
                            <FaRegHeart size={24} className="like_icon" />
                        </button>
                    )}
                </div>
            </div>
            <div className="product_card_prod_price_cont">
                <div className="product_card_prod_price">
                    <span>{CurrencySymbol}</span>
                    <span>{formatPriceAbbreviated(data?.price)}</span>
                </div>
                <p className="product_card_prod_date">{formatDate(data?.created_at)}&lrm;</p>
            </div>
            <p className="product_card_prod_name">{data?.name}</p>
            {/* <span className='decs'>{data?.description}</span> */}
            <p className="product_card_prod_det">
                {data?.city}{data?.city ? "," : null}{data?.state}{data?.state ? "," : null}{data?.country}
            </p>
            
            {/* Service Interaction Buttons */}
            <div className="product_card_interactions">
                <ServiceInteractionButtons 
                    productData={data}
                    systemSettingsData={systemSettingsData}
                    onContactClick={handleContactClick}
                    onChatClick={handleChatClick}
                />
            </div>
            
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={compareList.some(item => item.id === data.id)}
                    onChange={handleCompareToggle}
                />
                <span className="text-sm font-medium text-gray-700">{t('Compare')}</span>
            </label>

        </div>
    )
}

export default ProductCard