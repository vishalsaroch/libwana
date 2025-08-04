'use client'
import React from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { selectCompareList, removeFromCompare, clearCompareList } from '@/redux/reuducer/compareSlice'
import { formatDate, formatPriceAbbreviated, placeholderImage, t } from '@/utils'
import { FaTimes, FaTrash, FaHeart, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTag, FaStar } from 'react-icons/fa'
import { BiBadgeCheck } from 'react-icons/bi'
import styles from './ProductCompare.module.css'
import { Row, Col, Space, Collapse, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'


const ProductCompare = ({ isOpen, onClose, filteredProducts }) => {
    const dispatch = useDispatch()
    const compareList = useSelector(selectCompareList)
    const systemSettingsData = useSelector((state) => state?.Settings)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol

    const handleRemoveProduct = (productId) => {
        if (!productId) {
            console.warn('Invalid product ID provided for removal');
            return;
        }
        dispatch(removeFromCompare(productId))
    }

    const handleClearAll = () => {
        dispatch(clearCompareList())
    }

    const formatCustomFields = (customFields) => {
        if (!customFields || !Array.isArray(customFields)) return []
        return customFields.map(field => ({
            name: field.name || 'Unknown',
            value: field.value || 'N/A'
        }))
    }

    const getComparisonFeatures = () => {
        const features = [
            { key: 'image', label: 'Product Image', type: 'image' },
            { key: 'name', label: 'Product Name', type: 'text' },
            { key: 'price', label: 'Price', type: 'price' },
            { key: 'category', label: 'Category', type: 'category' },
            { key: 'location', label: 'Location', type: 'location' },
            { key: 'created_at', label: 'Posted Date', type: 'date' },
            { key: 'description', label: 'Description', type: 'description' },
            { key: 'seller', label: 'Seller', type: 'seller' },
            { key: 'is_feature', label: 'Featured', type: 'boolean' },
            { key: 'status', label: 'Status', type: 'status' },
            { key: 'custom_fields', label: 'Specifications', type: 'custom_fields' }
        ]
        return features
    }

    const renderFeatureValue = (product, feature) => {
        switch (feature.type) {
            case 'image':
                return (
                    <div className="compare-image-container">
                        <Image 
                            src={product?.image || '/assets/Transperant_Placeholder.png'} 
                            width={150} 
                            height={120} 
                            alt={product?.name || 'Product'} 
                            className="compare-product-image"
                            onErrorCapture={placeholderImage}
                        />
                        {product?.is_feature && (
                            <div className="compare-featured-badge">
                                <BiBadgeCheck size={16} color="white" />
                                <span>{t('featured')}</span>
                            </div>
                        )}
                    </div>
                )
            
            case 'price':
                return (
                    <div className="compare-price">
                        <span className="currency">{CurrencySymbol}</span>
                        <span className="amount">{formatPriceAbbreviated(product?.price)}</span>
                    </div>
                )
            
            case 'category':
                return product?.category_name || 'N/A'
            
            case 'location':
                return (
                    <div className="compare-location">
                        <FaMapMarkerAlt className="location-icon" />
                        <span>
                            {[product?.city, product?.state, product?.country]
                                .filter(Boolean)
                                .join(', ') || 'Location not specified'}
                        </span>
                    </div>
                )
            
            case 'date':
                return (
                    <div className="compare-date">
                        <FaCalendarAlt className="date-icon" />
                        <span>{formatDate(product?.created_at)}</span>
                    </div>
                )
            
            case 'description':
                return (
                    <div className="compare-description">
                        {product?.description ? 
                            product.description.length > 100 ? 
                                `${product.description.substring(0, 100)}...` : 
                                product.description 
                            : 'No description available'
                        }
                    </div>
                )
            
            case 'seller':
                return (
                    <div className="compare-seller">
                        <FaUser className="seller-icon" />
                        <span>{product?.user?.name || 'Unknown Seller'}</span>
                    </div>
                )
            
            case 'boolean':
                return product?.is_feature ? 
                    <span className="feature-yes">Yes</span> : 
                    <span className="feature-no">No</span>
            
            case 'status':
                return (
                    <span className={`status-badge status-${product?.status}`}>
                        {product?.status || 'Unknown'}
                    </span>
                )
            
            case 'custom_fields':
                const customFields = formatCustomFields(product?.custom_fields)
                return customFields.length > 0 ? (
                    <div className="compare-custom-fields">
                        {customFields.map((field, idx) => (
                            <div key={idx} className="custom-field-item">
                                <strong>{field.name}:</strong> {field.value}
                            </div>
                        ))}
                    </div>
                ) : 'No specifications available'
            
            default:
                return product?.[feature.key] || 'N/A'
        }
    }

    if (!isOpen) return null

    return (
        <div className={`${filteredProducts ? 'compare-page-container' : 'compare-modal-overlay'}`}>
            <div className={`${filteredProducts ? 'compare-page-content' : 'compare-modal'}`}>
                <div className="compare-header">
                    <h2 className="compare-title">
                        <FaTag className="compare-icon" />
                        {t('Product Comparison')} ({compareList.length} {t('products')})
                    </h2>
                    <div className="compare-actions">
                        <button 
                            className="btn-clear-all"
                            onClick={handleClearAll}
                            disabled={compareList.length === 0}
                        >
                            <FaTrash /> {t('Clear All')}
                        </button>
                        <button className="btn-close" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {compareList.length === 0 ? (
                    <div className="compare-empty">
                        <div className="empty-state">
                            <FaTag size={48} className="empty-icon" />
                            <h3>{t('No products to compare')}</h3>
                            <p>{t('Select products from the listing to compare their features')}</p>
                        </div>
                    </div>
                ) : filteredProducts.length < 2 ? (
                    <div className="compare-insufficient">
                        <div className="insufficient-state">
                            <FaTag size={48} className="insufficient-icon" />
                            <h3>{t('Select at least 2 products to compare')}</h3>
                            <p>{t('You have selected')} {compareList.length} {t('product(s). Add more to compare.')}</p>
                        </div>
                    </div>
                ) : (
                 <div className="compare-content">
    <div className="compare-grid-container">
        <Row gutter={[16, 16]} wrap>
            {/* First Column for Feature Labels */}
            <Col xs={24} sm={6}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {getComparisonFeatures().map((feature) => (
                        <div key={feature.key} className="feature-label">
                            <strong>{t(feature.label)}</strong>
                        </div>
                    ))}
                </Space>
            </Col>

            {/* Dynamic Columns for Products */}
          {compareList.filter(Boolean).map((product) => (
  <Col xs={24} sm={Math.floor(18 / compareList.filter(Boolean).length)} key={product.id}>

                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div className="product-header" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                shape="circle"
                                danger
                                icon={<FaTimes />}
                                size="small"
                                onClick={() => handleRemoveProduct(product.id)}
                            />
                        </div>
                        {getComparisonFeatures().map((feature) => (
                            <div key={feature.key} className="feature-value">
                                {renderFeatureValue(product, feature)}
                            </div>
                        ))}
                    </Space>
                </Col>
            ))}
        </Row>
    </div>
</div>

                )}

                <div className="compare-footer">
                    <div className="compare-info">
                        <p>{t('You can compare up to 4 products at once')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCompare
