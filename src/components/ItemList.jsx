import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function ItemList({ setPage, setSelectedAuction }) {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/auctions`)
      .then(res => setAuctions(res.data));
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {auctions.map(a => (
        <div
          key={a._id}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
        >
          <img
            src={a.productId?.image}
            className="h-40 w-full object-cover rounded"
          />

          <h3 className="text-zinc-100 mt-3">
            {a.productId?.title}
          </h3>

          <p className="text-amber-400 text-lg mt-1">
            ₹{a.highestBid || a.startingPrice}
          </p>

          <button
            onClick={() => {
              setSelectedAuction(a._id);
              setPage("details");
            }}
            className="mt-3 w-full bg-indigo-500 py-2 rounded"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
