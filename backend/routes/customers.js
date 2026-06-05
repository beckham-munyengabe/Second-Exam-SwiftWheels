import express from "express";
import Customer from "../models/Customer.js";
import { auth, requireAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, requireAdmin, async (req, res) => {
  const { q = "" } = req.query;
  const filter = q ? { $or: [
    { full_name: new RegExp(q, "i") }, { national_id: new RegExp(q, "i") },
    { phone: new RegExp(q, "i") }, { email: new RegExp(q, "i") }
  ]} : {};
  res.json(await Customer.find(filter).sort("-createdAt"));
});
router.get("/:id", auth, async (req, res) => {
  const c = await Customer.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json(c);
});
router.post("/", auth, requireAdmin, async (req, res) => {
  try { res.status(201).json(await Customer.create(req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.put("/:id", auth, async (req, res) => {
  try { res.json(await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.delete("/:id", auth, requireAdmin, async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
export default router;
