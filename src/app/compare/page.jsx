
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
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const productIds = searchParams.get('products');
    if (productIds && compareList.length > 0) {
      const ids = productIds.split(',').map(id => parseInt(id, 10));
      // Filter the compareList to only show products that were selected
      const selectedProducts = compareList.filter(product => ids.includes(product.id));
      setFilteredProducts(selectedProducts);
    } else {
      // If no URL parameters, show all items in compare list
      setFilteredProducts(compareList);
    }
  }, [searchParams, compareList]);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <ProductCompare 
        isOpen={true} 
        onClose={handleClose} 
        filteredProducts={filteredProducts}
      />
    </div>
  );
};

export default ComparePage;

