import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function SellerDashboard({
  user,
  setPage,
  setSelectedAuction
}) {

  if (!user || user.role !== "seller") {
    return (
      <div className="p-6 text-center text-red-500 text-xl">
        ❌ Access Denied – Only sellers can view this page.
      </div>
    );
  }

  const [products, setProducts] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: ""
  });
  const [auctionModal, setAuctionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auctionForm, setAuctionForm] = useState({
    startingPrice: "",
    endTime: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("auction_token");

    const p = await axios.get(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(p.data);

    const a = await axios.get(`${API_URL}/auctions`);
    setAuctions(a.data);
  }

  async function createProduct() {
    const token = localStorage.getItem("auction_token");
    if (!token) return alert("Login as seller");

    try {
      await axios.post(`${API_URL}/products`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Product created");
      setForm({ title: "", description: "", image: "", category: "" });
      fetchData();
    } catch (e) {
      alert(e.response?.data?.error || "Error creating product");
    }
  }

  function openAuctionModal(productId) {
    setSelectedProduct(productId);
    setAuctionForm({ startingPrice: "", endTime: "" });
    setAuctionModal(true);
  }

  async function createAuction() {
    const token = localStorage.getItem("auction_token");
    if (!token) return alert("Login");

    try {
      await axios.post(
        `${API_URL}/auctions`,
        {
          productId: selectedProduct,
          startingPrice: Number(auctionForm.startingPrice),
          endTime: new Date(auctionForm.endTime).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Auction created");
      setAuctionModal(false);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.error || "Error creating auction");
    }
  }

  function openDetails(auctionId) {
    setSelectedAuction(auctionId);
    setPage("details");
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* CREATE PRODUCT */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h3 className="text-xl text-amber-400 mb-4">Create Product</h3>

        <div className="grid gap-3">
          {["title", "image", "category"].map((field) => (
            <input
              key={field}
              className="bg-zinc-800 text-zinc-200 p-2 rounded"
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}

          <textarea
            className="bg-zinc-800 text-zinc-200 p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            onClick={createProduct}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded w-fit"
          >
            Save
          </button>
        </div>
      </div>

      {/* PRODUCTS + AUCTIONS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PRODUCTS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg text-white mb-4">Your Products</h3>

          {products.map((p) => (
            <div
              key={p._id}
              className="bg-zinc-800 rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{p.title}</p>
                <p className="text-sm text-zinc-400">{p.category}</p>
              </div>

              <button
                onClick={() => openAuctionModal(p._id)}
                className="bg-indigo-500 px-3 py-2 rounded"
              >
                Create Auction
              </button>
            </div>
          ))}
        </div>

        {/* AUCTIONS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg text-amber-100 mb-4">Your Auctions</h3>

          {auctions.map((a) => (
            <div
              key={a._id}
              onClick={() => openDetails(a._id)}
              className="bg-zinc-800 rounded-lg p-4 cursor-pointer hover:bg-zinc-700 transition"
            >
              <div className="flex justify-between text-white">
                <span>{a.productId?.title}</span>
                <span className="text-amber-400">
                  ₹{a.highestBid || a.startingPrice}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Ends: {new Date(a.endTime).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AUCTION MODAL */}
      {auctionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl text-amber-400 mb-4">Create Auction</h3>

            <input
              type="number"
              placeholder="Starting Price"
              className="bg-zinc-800 p-2 rounded w-full mb-3"
              value={auctionForm.startingPrice}
              onChange={(e) =>
                setAuctionForm({ ...auctionForm, startingPrice: e.target.value })
              }
            />

            <input
              type="datetime-local"
              className="bg-zinc-800 p-2 rounded w-full mb-4"
              value={auctionForm.endTime}
              onChange={(e) =>
                setAuctionForm({ ...auctionForm, endTime: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setAuctionModal(false)}>Cancel</button>
              <button
                onClick={createAuction}
                className="bg-amber-500 px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
