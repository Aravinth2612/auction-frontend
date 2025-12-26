import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Browse({ setPage, setSelectedAuction }) {
  const [auctions, setAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchAuctions();
  }, []);

  // Fetch all auctions
  async function fetchAuctions() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auctions`
      );
      setAuctions(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching auctions:", err);
    }
  }

  // Filter logic
  useEffect(() => {
    let results = auctions;

    if (search.trim() !== "") {
      results = results.filter((a) =>
        a.productId?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      results = results.filter((a) => a.type === category);
    }

    setFiltered(results);
  }, [search, category, auctions]);

  const categories = ["all", "standard", "sealed", "reverse"];

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Title */}
      <h2 className="text-3xl font-semibold text-amber-400 mb-6">Browse Auctions</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="bg-zinc-800 border border-zinc-800 text-zinc-100 p-3 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)} Auctions
            </option>
          ))}
        </select>
      </div>

      {/* Auction Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => (
          <div
            key={a._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition cursor-pointer"
            onClick={() => {
              setSelectedAuction(a._id);
              setPage("details");
            }}
          >
            <img
              src={a.productId?.image || "https://via.placeholder.com/400x240"}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold text-zinc-100">{a.productId?.title}</h3>
              <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                {a.productId?.description}
              </p>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">
                  {a.type.toUpperCase()}
                </span>
                <span className="text-amber-400 font-semibold">
                  ₹{a.highestBid || a.startingPrice}
                </span>
              </div>

              <p className="text-sm text-zinc-300 mt-1">
                Ends: {new Date(a.endTime).toLocaleDateString()}
              </p>

              <button className="mt-4 w-full bg-amber-500 hover-amber-400 rounded-md text-zinc-900 py-2 transition">
                View Auction
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500 mt-10 text-lg">
          No auctions found.
        </p>
      )}
    </div>
  );
}
