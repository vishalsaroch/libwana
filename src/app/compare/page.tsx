'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ComparePage = () => {
  const searchParams = useSearchParams();
  const ids = searchParams.get('products')?.split(',') || [];
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (ids.length >= 2) {
        const res = await axios.get(`/api/products/compare?ids=${ids.join(',')}`);
        setProducts(res.data);
      }
    };
    fetchProducts();
  }, [ids]);

  if (products.length < 2) return <p>Select at least two products to compare.</p>;

  return (
    <div className="comparison-table">
      <h2>Product Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            {products.map((p) => (
              <th key={p.id}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            {products.map((p) => (
              <td key={p.id}>₹{p.price}</td>
            ))}
          </tr>
          <tr>
            <td>Category</td>
            {products.map((p) => (
              <td key={p.id}>{p.category_name}</td>
            ))}
          </tr>
          <tr>
            <td>Delivery Available</td>
            {products.map((p) => (
              <td key={p.id}>{p.delivery_available ? 'Yes' : 'No'}</td>
            ))}
          </tr>
          {/* Add more fields like start_price, end_time, etc. */}
        </tbody>
      </table>
    </div>
  );
};

export default ComparePage;
