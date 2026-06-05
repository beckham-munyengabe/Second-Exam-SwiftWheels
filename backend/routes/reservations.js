import express from "express";
import Reservation from "../models/Reservation.js";
import Vehicle from "../models/Vehicle.js";
import { auth, requireAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { q = "" } = req.query;
  const base = req.user.role === "customer" ? { customer: req.query.customerId } : {};
  let list = await Reservation.find(base).populate("customer vehicle recorded_by").sort("-createdAt");
  if (q) {
    const r = new RegExp(q, "i");
    list = list.filter(x => r.test(x.customer?.full_name||"") || r.test(x.vehicle?.plate_number||"")
      || r.test(x.reservation_status) || r.test(x.rental_status));
  }
  res.json(list);
});
router.post("/", auth, async (req, res) => {
  try {
    const data = { ...req.body, recorded_by: req.user.id };
    const r = await Reservation.create(data);
    if(data.reservation_status==="confirmed") await Vehicle.findByIdAndUpdate(data.vehicle, { status: "reserved" });
    res.status(201).json(await r.populate("customer vehicle recorded_by"));
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const r = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("customer vehicle recorded_by");
    if (r?.rental_status === "active") await Vehicle.findByIdAndUpdate(r.vehicle._id, { status: "rented" });
    if (r?.rental_status === "returned") await Vehicle.findByIdAndUpdate(r.vehicle._id, { status: "available" });
    res.json(r);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put("/:id/approve", auth, requireAdmin, async (req,res)=>{
 const r=await Reservation.findByIdAndUpdate(req.params.id,{reservation_status:"confirmed"},{new:true});
 if(r) await Vehicle.findByIdAndUpdate(r.vehicle,{status:"reserved"});
 res.json(r);
});

router.delete("/:id", auth, requireAdmin, async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
export default router;
