import express from "express";
import Reservation from "../models/Reservation.js";
import { auth, requireAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/full", auth, requireAdmin, async (_req, res) => {
  const rows = await Reservation.find().populate("customer vehicle").sort("-createdAt");
  res.json(rows.map(r => ({
    customer_full_name: r.customer?.full_name,
    customer_national_id: r.customer?.national_id,
    customer_phone: r.customer?.phone,
    vehicle_plate_number: r.vehicle?.plate_number,
    vehicle_brand: r.vehicle?.brand,
    vehicle_model: r.vehicle?.model,
    year: r.vehicle?.year,
    vehicle_type: r.vehicle?.vehicle_type,
    reservation_date: r.reservation_date,
    rental_start: r.start_date,
    rental_end: r.end_date,
    reservation_status: r.reservation_status,
    rental_date: r.rental_date,
    return_date: r.return_date,
    rental_fee: r.rental_fee,
    rental_status: r.rental_status
  })));
});
export default router;
