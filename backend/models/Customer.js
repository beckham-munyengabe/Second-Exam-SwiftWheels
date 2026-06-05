import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
  full_name: { type: String, required: true, trim: true },
  national_id: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  address: { type: String, required: true, trim: true }
}, { timestamps: true });
export default mongoose.model("Customer", customerSchema);
