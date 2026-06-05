import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Customer from "../models/Customer.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, full_name, national_id, phone, email, address } = req.body;
    if (!username || !password || !full_name || !national_id || !phone || !email || !address)
      return res.status(400).json({ message: "All fields required" });
    if (await User.findOne({ username })) return res.status(400).json({ message: "Username taken" });
    if (await Customer.findOne({ $or: [{ national_id }, { email }] }))
      return res.status(400).json({ message: "Customer with this National ID or Email exists" });
    const customer = await Customer.create({ full_name, national_id, phone, email, address });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role: "customer", customer: customer._id });
    res.status(201).json({ message: "Account created", userId: user._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate("customer");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, customer: user.customer } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Forgot password - step 1: verify email exists in DB
router.post("/forgot-password/verify", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const customer = await Customer.findOne({ email: email.trim().toLowerCase() });
    if (!customer) {
      // Try case-insensitive
      const alt = await Customer.findOne({ email: new RegExp("^" + email.trim() + "$", "i") });
      if (!alt) return res.status(404).json({ message: "No account found with this email" });
      const u = await User.findOne({ customer: alt._id });
      if (!u) return res.status(404).json({ message: "No account linked to this email" });
      return res.json({ message: "Email verified", username: u.username });
    }
    const user = await User.findOne({ customer: customer._id });
    if (!user) return res.status(404).json({ message: "No account linked to this email" });
    res.json({ message: "Email verified", username: user.username });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Forgot password - step 2: reset password using verified email
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password are required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const customer = await Customer.findOne({ email: new RegExp("^" + email.trim() + "$", "i") });
    if (!customer) return res.status(404).json({ message: "No account found with this email" });
    const user = await User.findOne({ customer: customer._id });
    if (!user) return res.status(404).json({ message: "No account linked to this email" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully. You can now sign in." });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
