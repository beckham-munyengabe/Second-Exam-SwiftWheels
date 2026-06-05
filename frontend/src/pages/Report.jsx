import { useEffect, useState } from "react";
import api from "../lib/api";

const fmt = d => d ? new Date(d).toLocaleDateString() : "—";
export default function Report() {
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async()=> setRows((await api.get("/reports/full")).data))(); }, []);
  const print = () => window.print();
  return (
    <div>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Customer–Vehicle–Reservation Report</h1>
          <p className="text-slate-500 text-sm">SwiftWheels Enterprises • Huye, Rwanda</p>
        </div>
        <button className="btn-primary" onClick={print}>🖨 Print / Export</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-brand-600 text-white">
            <tr>{["Customer","Nat. ID","Phone","Plate","Brand","Model","Year","Type","Reserv. Date","Start","End","Res. Status","Rental Date","Return Date","Fee","Rental Status"].map(h=>
              <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length===0 && <tr><td colSpan="16" className="text-center text-slate-400 py-8">No records</td></tr>}
            {rows.map((r,i)=>(
              <tr key={i} className="border-b border-slate-100">
                <td className="px-2 py-2">{r.customer_full_name}</td>
                <td className="px-2 py-2">{r.customer_national_id}</td>
                <td className="px-2 py-2">{r.customer_phone}</td>
                <td className="px-2 py-2">{r.vehicle_plate_number}</td>
                <td className="px-2 py-2">{r.vehicle_brand}</td>
                <td className="px-2 py-2">{r.vehicle_model}</td>
                <td className="px-2 py-2">{r.year}</td>
                <td className="px-2 py-2">{r.vehicle_type}</td>
                <td className="px-2 py-2">{fmt(r.reservation_date)}</td>
                <td className="px-2 py-2">{fmt(r.rental_start)}</td>
                <td className="px-2 py-2">{fmt(r.rental_end)}</td>
                <td className="px-2 py-2">{r.reservation_status}</td>
                <td className="px-2 py-2">{fmt(r.rental_date)}</td>
                <td className="px-2 py-2">{fmt(r.return_date)}</td>
                <td className="px-2 py-2">{r.rental_fee?.toLocaleString()}</td>
                <td className="px-2 py-2">{r.rental_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
