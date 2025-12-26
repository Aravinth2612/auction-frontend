import React, { useState } from 'react';
import axios from 'axios';
export default function Login({ onLogin }) {
    const [form, setForm] = useState({ email: '', password: '' });
    async function submit() {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/login`, form);
            onLogin(res.data.user, res.data.token);
        } catch (e) {
            alert(e.response?.data?.error || 'Login failed');
        }
    }
    return (
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-amber-400 mb-6">Login</h2>
            <input className="text-zinc-300 w-full p-2 border mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="text-zinc-300 w-full p-2 border mb-2" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <button onClick={submit} className="bg-amber-500 hover:bg-amber-400 text-zinc px-4 py-2 rounded">Login</button>
        </div>
    );
}
