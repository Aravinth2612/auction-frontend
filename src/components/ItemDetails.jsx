import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function ItemDetails({ auctionId, user }) {
  const [auction, setAuction] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auctionId) fetchAuction();
  }, [auctionId]);

  async function fetchAuction() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/auctions/${auctionId}`
      );
      setAuction(data);
    } catch (error) {
      alert("Failed to load auction");
    } finally {
      setLoading(false);
    }
  }

  async function placeBid() {
    const token = localStorage.getItem("auction_token");
    if (!token) return alert("Login to place a bid");

    if (!amount || Number(amount) <= 0)
      return alert("Enter a valid amount");

    if (Number(amount) <= (auction.highestBid || auction.startingPrice)) {
      return alert("Bid must be higher than current price");
    }

    try {
      await axios.post(
        `${API_URL}/auctions/${auctionId}/bid`,
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Bid placed successfully");
      setAmount("");
      fetchAuction();

    } catch (err) {
      alert(err.response?.data?.error || "Bid failed");
    }
  }

  if (loading) return <p className="text-center">Loading...</p>;
  if (!auction) return <p>Auction not found</p>;

  const isSeller = user && user.role === "seller";

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <img
        src={auction.productId?.image || "https://via.placeholder.com/600"}
        className="w-full h-72 object-cover rounded-lg"
      />

      <h2 className="text-2xl text-white mt-4">
        {auction.productId?.title}
      </h2>

      <p className="text-zinc-400 mt-2">
        {auction.productId?.description}
      </p>

      <p className="mt-4 text-zinc-300">
        Ends: {new Date(auction.endTime).toLocaleString()}
      </p>

      {/* ✅ FIXED highestBid */}
      <p className="text-3xl text-amber-400 mt-2">
        ₹{auction.highestBid || auction.startingPrice}
      </p>

      {/* ✅ Only buyers can bid */}
      {user && !isSeller && (
        <div className="mt-4 flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-zinc-800 text-white p-2 rounded w-40"
            placeholder="Your bid"
          />
          <button
            onClick={placeBid}
            className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded text-white"
          >
            Place Bid
          </button>
        </div>
      )}

      {isSeller && (
        <p className="mt-4 text-sm text-zinc-500">
          Sellers cannot place bids on their own auctions
        </p>
      )}
    </div>
  );
}
