'use client';

import React from "react";
import Auction from '../../../components/Autcion/Autction';

export default function AuctionPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Auction Dashboard</h1>
      <Auction />
    </div>
  );
}