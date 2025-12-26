import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import SellerDashboard from './components/SellerDashboard';
import Browse from './Browse';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('auction_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  function login(userObj, token) {
    setUser(userObj);
    localStorage.setItem('auction_user', JSON.stringify(userObj));
    localStorage.setItem('auction_token', token);
    setPage('home');
  }
  function logout() {
    setUser(null);
    localStorage.removeItem('auction_user');
    localStorage.removeItem('auction_token');
    setPage('home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-900">
      <Navbar setPage={setPage} page={page} user={user} logout={logout} />
      <div className="container mx-auto px-6 py-6">
        {page === 'home' && (
          <ItemList
            setPage={setPage}
            setSelectedAuction={setSelectedAuction}
          />
        )}
        {page === 'browse' && (
          <Browse
            setPage={setPage}
            setSelectedAuction={setSelectedAuction}
          />
        )}
        {page === 'register' && <Register onRegistered={() => setPage('login')} />}
        {page === 'login' && <Login onLogin={login} />}
        {page === 'details' && <ItemDetails auctionId={selectedAuction} user={user} />}
        {page === 'seller' && <SellerDashboard user={user} />}
      </div>
    </div>
  );
}
