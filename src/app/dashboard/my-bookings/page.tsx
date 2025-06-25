'use client';
import { useEffect, useState } from 'react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([
    { id: 1, service: 'haircut', date: '2025-06-25T10:00:00Z' },
    { id: 2, service: 'spa', date: '2025-06-26T12:00:00Z' }
  ]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id} className="mb-2">
            {b.service} on {new Date(b.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
