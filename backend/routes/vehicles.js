import express from "express";
import Vehicle from "../models/Vehicle.js";
import { auth, requireAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { q = "" } = req.query;
  const filter = q ? { $or: [
    { plate_number: new RegExp(q, "i") }, { brand: new RegExp(q, "i") },
    { model: new RegExp(q, "i") }, { vehicle_type: new RegExp(q, "i") }, { status: new RegExp(q, "i") }
  ]} : {};
  res.json(await Vehicle.find(filter).sort("-createdAt"));
});
router.get("/available/list", auth, async (req, res) => {
  res.json(await Vehicle.find({ status: "available" }).sort("-createdAt"));
});
router.get("/:id", auth, async (req, res) => {
  const v = await Vehicle.findById(req.params.id);
  if (!v) return res.status(404).json({ message: "Not found" });
  res.json(v);
});
router.post("/", auth, requireAdmin, async (req, res) => {
  try { res.status(201).json(await Vehicle.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.put("/:id", auth, requireAdmin, async (req, res) => {
  try { res.json(await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
export default router;
