import { useEffect, useState } from "react";
import api from "../lib/api";
import Table from "../components/Table";
import Modal from "../components/Modal";

const empty = { full_name:"", national_id:"", phone:"", email:"", address:"" };
export default function Customers() {
  const [list, setList] = useState([]); const [q, setQ] = useState("");
  const [open, setOpen] = useState(false); const [form, setForm] = useState(empty); const [editId, setEditId] = useState(null);
  const load = async () => setList((await api.get(`/customers?q=${q}`)).data);
  useEffect(() => { load(); }, [q]);
  const submit = async e => {
    e.preventDefault();
    if (editId) await api.put(`/customers/${editId}`, form); else await api.post("/customers", form);
    setOpen(false); setForm(empty); setEditId(null); load();
  };
  const edit = c => { setForm(c); setEditId(c._id); setOpen(true); };
  const del = async id => { if (confirm("Delete customer?")) { await api.delete(`/customers/${id}`); load(); } };
  const set = k => e => setForm({...form,[k]:e.target.value});
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
        <div><h1 className="text-2xl font-bold">Customers</h1><p className="text-slate-500 text-sm">Manage registered customers</p></div>
        <button className="btn-primary" onClick={()=>{setForm(empty);setEditId(null);setOpen(true);}}>+ New Customer</button>
      </div>
      <input className="input mb-4 max-w-sm" placeholder="Search by name, ID, phone..." value={q} onChange={e=>setQ(e.target.value)}/>
      <Table columns={[
        {key:"full_name",label:"Full Name"},{key:"national_id",label:"National ID"},
        {key:"phone",label:"Phone"},{key:"email",label:"Email"},{key:"address",label:"Address"}
      ]} data={list} actions={r=>(
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-xs" onClick={()=>edit(r)}>Edit</button>
          <button className="btn-danger text-xs" onClick={()=>del(r._id)}>Delete</button>
        </div>
      )}/>
      <Modal open={open} onClose={()=>setOpen(false)} title={editId?"Edit Customer":"New Customer"}>
        <form onSubmit={submit} className="space-y-3">
          {["full_name","national_id","phone","email","address"].map(k=>(
            <div key={k}><label className="label capitalize">{k.replace("_"," ")}</label>
            <input className="input" value={form[k]} onChange={set(k)} required/></div>
          ))}
          <button className="btn-primary w-full justify-center">{editId?"Update":"Create"}</button>
        </form>
      </Modal>
    </div>
  );
}
