'use client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function BookingCalendar({ onSelect }: { onSelect: (date: Date) => void }) {
  return <Calendar onChange={onSelect} />;
}
