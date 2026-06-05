import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault(); setErr("");
    try {
      const { data } = await api.post("/auth/login", f);
      login(data.token, data.user); nav("/");
    } catch (e) { setErr(e.response?.data?.message || "Login failed"); }
  };
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-brand-700 to-brand-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="text-2xl font-bold">SwiftWheels Enterprises</div>
          <div className="text-brand-50/80 mt-1">Vehicle Rental & Reservation System</div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Drive your journey,<br/>seamlessly.</h1>
          <p className="mt-3 text-brand-50/80">Real-time vehicle availability, bookings, and sales for Huye City and beyond.</p>
        </div>
        <div className="text-sm text-brand-50/70">© SwiftWheels • Huye, Southern Province, Rwanda</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="card p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-slate-500 mb-6 text-sm">Sign in to manage your reservations.</p>
          {err && <div className="bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-sm mb-4">{err}</div>}
          <label className="label">Username</label>
          <input className="input mb-4" value={f.username} onChange={e=>setF({...f,username:e.target.value})} required />
          <label className="label">Password</label>
          <input type="password" className="input mb-6" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required />
          <div className="flex justify-end mb-3 -mt-3"><Link to="/forgot-password" className="text-sm text-brand-600 font-medium">Forgot password?</Link></div>
          <button className="btn-primary w-full justify-center">Sign In</button>
          <p className="text-sm text-center mt-4 text-slate-600">
            No account? <Link to="/register" className="text-brand-600 font-medium">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
