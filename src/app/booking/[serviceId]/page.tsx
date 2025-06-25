'use client';
import { useRouter } from 'next/navigation';
import BookingCalendar from '@/components/booking/BookingCalendar';

export default function ServiceBooking({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const handleDateSelect = (date: Date) => {
    router.push(`/booking/summary?service=${params.serviceId}&date=${date.toISOString()}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Book: {params.serviceId}</h2>
      <BookingCalendar onSelect={handleDateSelect} />
    </div>
  );
}
