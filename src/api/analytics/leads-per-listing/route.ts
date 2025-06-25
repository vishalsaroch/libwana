import { NextResponse } from 'next/server';

export async function GET() {
  // Swap in the real PHP path:
  const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/your-real-leads-endpoint`;
  
  const res = await fetch(BACKEND_URL);
  if (!res.ok) {
    return NextResponse.json({ error: 'Backend error', status: res.status }, { status: 502 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
