import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["administrator", "customer"], required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
