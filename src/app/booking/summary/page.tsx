'use client';
import { useSearchParams } from 'next/navigation';

export default function BookingSummary() {
  const params = useSearchParams();
  const service = params.get('service');
  const date = params.get('date');

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Confirm Booking</h2>
      <p>Service: {service}</p>
      <p>Date: {new Date(date || '').toLocaleString()}</p>
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
        Confirm Booking
      </button>
    </div>
  );
}
