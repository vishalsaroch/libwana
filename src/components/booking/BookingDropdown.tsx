'use client';
import React from 'react';

export default function BookingDropdown({ onChange }: { onChange: (val: string) => void }) {
  const options = ['Haircut', 'Spa', 'Massage'];

  return (
    <select onChange={(e) => onChange(e.target.value)} className="border p-2 rounded">
      <option value="">Select Service</option>
      {options.map((item, i) => (
        <option key={i} value={item.toLowerCase()}>{item}</option>
      ))}
    </select>
  );
}
