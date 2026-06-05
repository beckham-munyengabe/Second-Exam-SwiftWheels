import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Register() {
  const [f, setF] = useState({ full_name:"", national_id:"", phone:"", email:"", address:"", username:"", password:"" });
  const [err, setErr] = useState(""); const [ok, setOk] = useState("");
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault(); setErr(""); setOk("");
    try { await api.post("/auth/register", f); setOk("Account created! Redirecting..."); setTimeout(()=>nav("/login"),1200); }
    catch (e) { setErr(e.response?.data?.message || "Registration failed"); }
  };
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-br from-slate-100 to-brand-50">
      <form onSubmit={submit} className="card p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold">Create Customer Account</h2>
        <p className="text-slate-500 text-sm mb-6">Register to reserve and rent vehicles at SwiftWheels.</p>
        {err && <div className="bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-sm mb-4">{err}</div>}
        {ok && <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm mb-4">{ok}</div>}
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Full Name</label><input className="input" value={f.full_name} onChange={set("full_name")} required/></div>
          <div><label className="label">National ID</label><input className="input" value={f.national_id} onChange={set("national_id")} required/></div>
          <div><label className="label">Phone</label><input className="input" value={f.phone} onChange={set("phone")} required/></div>
          <div><label className="label">Email</label><input type="email" className="input" value={f.email} onChange={set("email")} required/></div>
          <div className="md:col-span-2"><label className="label">Address</label><input className="input" value={f.address} onChange={set("address")} required/></div>
          <div><label className="label">Username</label><input className="input" value={f.username} onChange={set("username")} required/></div>
          <div><label className="label">Password</label><input type="password" className="input" value={f.password} onChange={set("password")} required/></div>
        </div>
        <button className="btn-primary w-full justify-center mt-6">Create Account</button>
        <p className="text-sm text-center mt-4 text-slate-600">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
