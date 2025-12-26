import React, { useState } from 'react';
import axios from 'axios';
export default function Register({ onRegistered }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    async function submit() {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/register`, form);
            alert('Registered');
            onRegistered?.();
        } catch (e) {
            alert(e.response?.data?.error || 'Error');
        }
    }
    return (
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-amber-400 mb-6">Register</h2>
            <input className="text-zinc-300 w-full p-2 border mb-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="text-zinc-300 w-full p-2 border mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" className="text-zinc-300 w-full p-2 border mb-2" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <select className="text-zinc-300 w-full p-2 border mb-4" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option className="bg-zinc-900 text-zinc-200" value="user">User</option>
                <option className="bg-zinc-900 text-zinc-200" value="seller">Seller</option>
            </select>
            <button onClick={submit} className="bg-amber-500 hover:bg-amber-400 text-zinc-900 px-4 py-2 rounded">Register</button>
        </div>
    );
}
