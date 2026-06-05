import { useEffect, useState } from "react";
import api from "../lib/api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

const empty = { plate_number:"", brand:"", model:"", year:2024, vehicle_type:"", purchase_price:0, status:"available" };
const statusColor = s => ({available:"bg-emerald-100 text-emerald-700",reserved:"bg-amber-100 text-amber-700",rented:"bg-blue-100 text-blue-700",sold:"bg-slate-200 text-slate-700",maintenance:"bg-rose-100 text-rose-700"}[s]||"bg-slate-100");

export default function Vehicles() {
  const { user } = useAuth();
  const isAdmin = user?.role==="administrator";
  const [list, setList] = useState([]); const [q, setQ] = useState("");
  const [open, setOpen] = useState(false); const [form, setForm] = useState(empty); const [editId, setEditId] = useState(null);
  const load = async () => setList((await api.get(`/vehicles?q=${q}`)).data);
  useEffect(()=>{ load(); }, [q]);
  const submit = async e => {
    e.preventDefault();
    if (editId) await api.put(`/vehicles/${editId}`, form); else await api.post("/vehicles", form);
    setOpen(false); setForm(empty); setEditId(null); load();
  };
  const edit = v => { setForm(v); setEditId(v._id); setOpen(true); };
  const del = async id => { if (confirm("Delete vehicle?")) { await api.delete(`/vehicles/${id}`); load(); } };
  const set = k => e => setForm({...form,[k]: e.target.type==="number"?+e.target.value:e.target.value});
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
        <div><h1 className="text-2xl font-bold">Vehicles</h1><p className="text-slate-500 text-sm">Fleet inventory</p></div>
        {isAdmin && <button className="btn-primary" onClick={()=>{setForm(empty);setEditId(null);setOpen(true);}}>+ New Vehicle</button>}
      </div>
      <input className="input mb-4 max-w-sm" placeholder="Search plate, brand, model..." value={q} onChange={e=>setQ(e.target.value)}/>
      <Table columns={[
        {key:"plate_number",label:"Plate"},{key:"brand",label:"Brand"},{key:"model",label:"Model"},
        {key:"year",label:"Year"},{key:"vehicle_type",label:"Type"},
        {key:"purchase_price",label:"Price (RWF)", render:r=>r.purchase_price.toLocaleString()},
        {key:"status",label:"Status", render:r=><span className={`badge ${statusColor(r.status)}`}>{r.status}</span>}
      ]} data={list} actions={isAdmin?r=>(
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-xs" onClick={()=>edit(r)}>Edit</button>
          <button className="btn-danger text-xs" onClick={()=>del(r._id)}>Delete</button>
        </div>
      ):null}/>
      <Modal open={open} onClose={()=>setOpen(false)} title={editId?"Edit Vehicle":"New Vehicle"}>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <div><label className="label">Plate</label><input className="input" value={form.plate_number} onChange={set("plate_number")} required/></div>
          <div><label className="label">Brand</label><input className="input" value={form.brand} onChange={set("brand")} required/></div>
          <div><label className="label">Model</label><input className="input" value={form.model} onChange={set("model")} required/></div>
          <div><label className="label">Year</label><input type="number" className="input" value={form.year} onChange={set("year")} required/></div>
          <div><label className="label">Type</label><input className="input" value={form.vehicle_type} onChange={set("vehicle_type")} required/></div>
          <div><label className="label">Purchase Price</label><input type="number" className="input" value={form.purchase_price} onChange={set("purchase_price")} required/></div>
          <div className="col-span-2"><label className="label">Status</label>
            <select className="input" value={form.status} onChange={set("status")}>
              {["available","reserved","rented","sold","maintenance"].map(s=><option key={s}>{s}</option>)}
            </select></div>
          <button className="btn-primary col-span-2 w-full justify-center">{editId?"Update":"Create"}</button>
        </form>
      </Modal>
    </div>
  );
}
