import { useEffect, useState } from "react";
import api from "../lib/api";
import Table from "../components/Table";
import Modal from "../components/Modal";

const empty = { customer:"", vehicle:"", start_date:"", end_date:"", reservation_status:"pending", rental_status:"not_started", rental_fee:0, rental_date:"", return_date:"" };
const fmt = d => d ? new Date(d).toLocaleDateString() : "—";

export default function Reservations() {
  const [list, setList] = useState([]); const [q, setQ] = useState("");
  const [customers, setCustomers] = useState([]); const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false); const [form, setForm] = useState(empty); const [editId, setEditId] = useState(null);
  const load = async () => setList((await api.get(`/reservations?q=${q}`)).data);
  useEffect(()=>{ load(); }, [q]);
  useEffect(()=>{ (async()=>{
    setCustomers((await api.get("/customers")).data);
    setVehicles((await api.get("/vehicles")).data);
  })(); }, []);
  const submit = async e => {
    e.preventDefault();
    const payload = { ...form, rental_fee: +form.rental_fee };
    if (editId) await api.put(`/reservations/${editId}`, payload); else await api.post("/reservations", payload);
    setOpen(false); setForm(empty); setEditId(null); load();
  };
  const edit = r => {
    setForm({ ...r, customer: r.customer._id, vehicle: r.vehicle._id,
      start_date: r.start_date?.slice(0,10), end_date: r.end_date?.slice(0,10),
      rental_date: r.rental_date?.slice(0,10) || "", return_date: r.return_date?.slice(0,10) || "" });
    setEditId(r._id); setOpen(true);
  };
  const del = async id => { if (confirm("Delete reservation?")) { await api.delete(`/reservations/${id}`); load(); } };
  const set = k => e => setForm({...form,[k]:e.target.value});
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
        <div><h1 className="text-2xl font-bold">Reservations & Rentals</h1><p className="text-slate-500 text-sm">All bookings recorded by staff</p></div>
        <button className="btn-primary" onClick={()=>{setForm(empty);setEditId(null);setOpen(true);}}>+ New Reservation</button>
      </div>
      <input className="input mb-4 max-w-sm" placeholder="Search customer, vehicle, status..." value={q} onChange={e=>setQ(e.target.value)}/>
      <Table columns={[
        {key:"customer",label:"Customer",render:r=>r.customer?.full_name},
        {key:"vehicle",label:"Vehicle",render:r=>`${r.vehicle?.plate_number} - ${r.vehicle?.brand}`},
        {key:"start_date",label:"Start",render:r=>fmt(r.start_date)},
        {key:"end_date",label:"End",render:r=>fmt(r.end_date)},
        {key:"reservation_status",label:"Res. Status",render:r=><span className="badge bg-amber-100 text-amber-700">{r.reservation_status}</span>},
        {key:"rental_status",label:"Rental",render:r=><span className="badge bg-blue-100 text-blue-700">{r.rental_status}</span>},
        {key:"rental_fee",label:"Fee (RWF)",render:r=>r.rental_fee?.toLocaleString()}
      ]} data={list} actions={r=>(
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-xs" onClick={()=>edit(r)}>Edit</button>
          <button className="btn-danger text-xs" onClick={()=>del(r._id)}>Delete</button>
        </div>
      )}/>
      <Modal open={open} onClose={()=>setOpen(false)} title={editId?"Edit Reservation":"New Reservation"}>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className="label">Customer</label>
            <select className="input" value={form.customer} onChange={set("customer")} required>
              <option value="">Select...</option>
              {customers.map(c=><option key={c._id} value={c._id}>{c.full_name} ({c.national_id})</option>)}
            </select></div>
          <div className="col-span-2"><label className="label">Vehicle</label>
            <select className="input" value={form.vehicle} onChange={set("vehicle")} required>
              <option value="">Select...</option>
              {vehicles.map(v=><option key={v._id} value={v._id}>{v.plate_number} - {v.brand} {v.model}</option>)}
            </select></div>
          <div><label className="label">Start Date</label><input type="date" className="input" value={form.start_date} onChange={set("start_date")} required/></div>
          <div><label className="label">End Date</label><input type="date" className="input" value={form.end_date} onChange={set("end_date")} required/></div>
          <div><label className="label">Rental Date</label><input type="date" className="input" value={form.rental_date} onChange={set("rental_date")}/></div>
          <div><label className="label">Return Date</label><input type="date" className="input" value={form.return_date} onChange={set("return_date")}/></div>
          <div><label className="label">Reservation Status</label>
            <select className="input" value={form.reservation_status} onChange={set("reservation_status")}>
              {["pending","confirmed","cancelled"].map(s=><option key={s}>{s}</option>)}
            </select></div>
          <div><label className="label">Rental Status</label>
            <select className="input" value={form.rental_status} onChange={set("rental_status")}>
              {["not_started","active","returned","overdue"].map(s=><option key={s}>{s}</option>)}
            </select></div>
          <div className="col-span-2"><label className="label">Rental Fee (RWF)</label><input type="number" className="input" value={form.rental_fee} onChange={set("rental_fee")}/></div>
          <button className="btn-primary col-span-2 w-full justify-center">{editId?"Update":"Create"}</button>
        </form>
      </Modal>
    </div>
  );
}
