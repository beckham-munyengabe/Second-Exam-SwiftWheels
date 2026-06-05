import mongoose from "mongoose";
const vehicleSchema = new mongoose.Schema({
  plate_number: { type: String, required: true, unique: true, uppercase: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  vehicle_type: { type: String, required: true, trim: true },
  purchase_price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["available", "reserved", "rented", "sold", "maintenance"], default: "available" }
}, { timestamps: true });
export default mongoose.model("Vehicle", vehicleSchema);
