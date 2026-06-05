import mongoose from "mongoose";
const reservationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reservation_date: { type: Date, default: Date.now },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  reservation_status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  rental_date: { type: Date },
  return_date: { type: Date },
  rental_fee: { type: Number, default: 0, min: 0 },
  rental_status: { type: String, enum: ["not_started", "active", "returned", "overdue"], default: "not_started" }
}, { timestamps: true });
export default mongoose.model("Reservation", reservationSchema);
