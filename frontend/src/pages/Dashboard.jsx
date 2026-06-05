import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ vehicles: 0, available: 0, reservations: 0 });
  useEffect(() => {
    (async () => {
      try {
        const v = await api.get("/vehicles");
        const r = await api.get("/reservations" + (user.role==="customer" ? `?customerId=${user.customer?._id}`:""));
        setStats({ vehicles: v.data.length, available: v.data.filter(x=>x.status==="available").length, reservations: r.data.length });
      } catch {}
    })();
  }, [user]);
  const cards = [
    { label: "Total Vehicles", value: stats.vehicles, color: "bg-brand-600" },
    { label: "Available Now", value: stats.available, color: "bg-emerald-600" },
    { label: user.role==="customer" ? "My Reservations" : "Total Reservations", value: stats.reservations, color: "bg-amber-600" }
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome, {user.username} 👋</h1>
      <p className="text-slate-500 mb-6">SwiftWheels VRS Dashboard — Huye, Rwanda</p>
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className="card p-6">
            <div className={`w-12 h-12 ${c.color} rounded-xl mb-3`}/>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-slate-500 text-sm">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
