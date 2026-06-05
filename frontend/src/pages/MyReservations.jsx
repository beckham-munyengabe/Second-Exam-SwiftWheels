import { useEffect, useState } from "react";
import api from "../lib/api";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

const fmt = d => d ? new Date(d).toLocaleDateString() : "—";
export default function MyReservations() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  useEffect(()=>{ (async()=>{
    const { data } = await api.get(`/reservations?customerId=${user.customer?._id}`);
    setList(data);
  })(); }, [user]);
  return (
    <div>
      <h1 className="text-2xl font-bold">My Reservations</h1>
      <p className="text-slate-500 text-sm mb-6">Track your bookings and rentals</p>
      <Table columns={[
        {key:"vehicle",label:"Vehicle",render:r=>`${r.vehicle?.plate_number} - ${r.vehicle?.brand} ${r.vehicle?.model}`},
        {key:"start_date",label:"Start",render:r=>fmt(r.start_date)},
        {key:"end_date",label:"End",render:r=>fmt(r.end_date)},
        {key:"reservation_status",label:"Reservation",render:r=><span className="badge bg-amber-100 text-amber-700">{r.reservation_status}</span>},
        {key:"rental_status",label:"Rental",render:r=><span className="badge bg-blue-100 text-blue-700">{r.rental_status}</span>},
        {key:"rental_fee",label:"Fee (RWF)",render:r=>r.rental_fee?.toLocaleString()}
      ]} data={list}/>
    </div>
  );
}
