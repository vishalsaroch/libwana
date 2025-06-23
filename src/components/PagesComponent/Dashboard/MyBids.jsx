'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyBids = () => {
  const [bids, setBids] = useState([])

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}my-bids`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        )
        setBids(res.data)
      } catch (err) {
        console.error('Failed to fetch bids:', err)
      }
    }

    fetchBids()
  }, [])

  if (!bids.length) return <p>No bids placed yet.</p>

  return (
    <div>
      <h2 className="page-title">My Auction Bids</h2>
      <div className="bid-list">
        {bids.map((bid) => (
          <div key={bid.id} className="bid-card">
            <h4>{bid.product_name}</h4>
            <p><strong>Your Bid:</strong> ₹{bid.amount}</p>
            <p>Status: {bid.is_winning ? '✅ Winning' : '❌ Outbid'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBids
