
import {useEffect,useState} from "react";
import api from "../lib/api";
import {useAuth} from "../context/AuthContext";
export default function CustomerReservation(){
 const {user}=useAuth();
 const [vehicles,setVehicles]=useState([]);
 const [form,setForm]=useState({vehicle:"",start_date:"",end_date:""});
 useEffect(()=>{api.get("/vehicles/available/list").then(r=>setVehicles(r.data));},[]);
 const submit=async(e)=>{
  e.preventDefault();
  await api.post("/reservations",{customer:user.customer?._id,vehicle:form.vehicle,start_date:form.start_date,end_date:form.end_date,reservation_status:"pending"});
  alert("Reservation request submitted");
 };
 return <div><h1>Request Reservation</h1><form onSubmit={submit}>
 <select value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})}>
 <option value=''>Select vehicle</option>
 {vehicles.map(v=><option key={v._id} value={v._id}>{v.plate_number} - {v.brand}</option>)}
 </select>
 <input type='date' onChange={e=>setForm({...form,start_date:e.target.value})}/>
 <input type='date' onChange={e=>setForm({...form,end_date:e.target.value})}/>
 <button type='submit'>Reserve</button>
 </form></div>
}
