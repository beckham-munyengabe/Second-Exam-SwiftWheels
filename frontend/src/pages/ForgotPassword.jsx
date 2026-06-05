import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const verify = async e => {
    e.preventDefault(); setErr(""); setMsg(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password/verify", { email });
      setUsername(data.username);
      setMsg("Email matched account: " + data.username);
      setStep(2);
    } catch (e) { setErr(e.response?.data?.message || "Verification failed"); }
    finally { setLoading(false); }
  };

  const reset = async e => {
    e.preventDefault(); setErr(""); setMsg(""); 
    if (pwd !== pwd2) { setErr("Passwords do not match"); return; }
    if (pwd.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/reset", { email, newPassword: pwd });
      setMsg("Password updated! Redirecting to login...");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) { setErr(e.response?.data?.message || "Reset failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-brand-700 to-brand-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="text-2xl font-bold">SwiftWheels Enterprises</div>
          <div className="text-brand-50/80 mt-1">Vehicle Rental & Reservation System</div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Recover your<br/>account.</h1>
          <p className="mt-3 text-brand-50/80">Verify your registered email to securely reset your password.</p>
        </div>
        <div className="text-sm text-brand-50/70">© SwiftWheels • Huye, Southern Province, Rwanda</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="card p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Forgot Password</h2>
          <p className="text-slate-500 mb-6 text-sm">
            {step === 1 ? "Enter the email used during registration." : "Set a new password for " + username + "."}
          </p>
          {err && <div className="bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-sm mb-4">{err}</div>}
          {msg && <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm mb-4">{msg}</div>}

          {step === 1 ? (
            <form onSubmit={verify}>
              <label className="label">Email Address</label>
              <input type="email" className="input mb-6" value={email}
                onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" />
              <button disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          ) : (
            <form onSubmit={reset}>
              <label className="label">New Password</label>
              <input type="password" className="input mb-4" value={pwd}
                onChange={e=>setPwd(e.target.value)} required minLength={6} />
              <label className="label">Confirm New Password</label>
              <input type="password" className="input mb-6" value={pwd2}
                onChange={e=>setPwd2(e.target.value)} required minLength={6} />
              <button disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          )}

          <p className="text-sm text-center mt-4 text-slate-600">
            Remembered it? <Link to="/login" className="text-brand-600 font-medium">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
