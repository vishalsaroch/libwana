
'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { t } from '@/utils';
import {
  selectCompareList,
  removeFromCompare,
  clearCompareList,
} from '@/redux/reuducer/compareSlice';
// import ProductCompare from '@/components/ProductCompare/ProductCompare';
import ProductCompare from '../../../src/components/ProductCompare/ProductCompare';

const ComparePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const compareList = useSelector(selectCompareList);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productIds = searchParams.get('products');
    if (productIds) {
      const ids = productIds.split(',').map(id => parseInt(id, 10));
      // Assuming you have a way to fetch product details by IDs
      // For now, I'll filter the compareList
      const selectedProducts = compareList.filter(product => ids.includes(product.id));
      setProducts(selectedProducts);
    }
  }, [searchParams, compareList]);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <ProductCompare isOpen={true} onClose={handleClose} />
    </div>
  );
};

export default ComparePage;

