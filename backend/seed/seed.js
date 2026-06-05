import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Vehicle from "../models/Vehicle.js";
import Reservation from "../models/Reservation.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding VRS...");

  await Promise.all([User.deleteMany({}), Customer.deleteMany({}), Vehicle.deleteMany({}), Reservation.deleteMany({})]);

  // ===== Single Administrator =====
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "Admin@123";
  const admin = await User.create({
    username: adminUser,
    password: await bcrypt.hash(adminPass, 10),
    role: "administrator"
  });
  console.log(`Administrator created: ${adminUser} / ${adminPass}`);

  // ===== Sample Customers =====
  const customers = await Customer.insertMany([
    { full_name: "Jean Bosco Habimana", national_id: "1199580012345678", phone: "0788111222", email: "jean@example.rw", address: "Huye, Southern Province" },
    { full_name: "Aline Uwase", national_id: "1199280087654321", phone: "0788333444", email: "aline@example.rw", address: "Tumba, Huye" },
    { full_name: "Eric Mugisha", national_id: "1198880011223344", phone: "0788555666", email: "eric@example.rw", address: "Ngoma, Huye" }
  ]);

  // Customer login accounts
  for (const c of customers) {
    await User.create({
      username: c.email.split("@")[0],
      password: await bcrypt.hash("Pass@123", 10),
      role: "customer",
      customer: c._id
    });
  }
  console.log("Customer logins: <emailprefix> / Pass@123");

  // ===== Sample Vehicles =====
  const vehicles = await Vehicle.insertMany([
    { plate_number: "RAB123A", brand: "Toyota", model: "RAV4", year: 2021, vehicle_type: "SUV", purchase_price: 25000000, status: "available" },
    { plate_number: "RAC456B", brand: "Hyundai", model: "Tucson", year: 2022, vehicle_type: "SUV", purchase_price: 28000000, status: "available" },
    { plate_number: "RAD789C", brand: "Toyota", model: "Hiace", year: 2020, vehicle_type: "Van", purchase_price: 22000000, status: "available" },
    { plate_number: "RAE321D", brand: "Nissan", model: "X-Trail", year: 2023, vehicle_type: "SUV", purchase_price: 30000000, status: "available" }
  ]);

  // ===== Sample Reservations =====
  await Reservation.insertMany([
    {
      customer: customers[0]._id, vehicle: vehicles[0]._id, recorded_by: admin._id,
      start_date: new Date(), end_date: new Date(Date.now() + 3*86400000),
      reservation_status: "confirmed", rental_fee: 150000, rental_status: "active",
      rental_date: new Date()
    },
    {
      customer: customers[1]._id, vehicle: vehicles[1]._id, recorded_by: admin._id,
      start_date: new Date(Date.now() + 86400000), end_date: new Date(Date.now() + 5*86400000),
      reservation_status: "pending", rental_fee: 200000, rental_status: "not_started"
    }
  ]);

  await Vehicle.findByIdAndUpdate(vehicles[0]._id, { status: "rented" });
  await Vehicle.findByIdAndUpdate(vehicles[1]._id, { status: "reserved" });

  console.log("Seed completed successfully.");
  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
