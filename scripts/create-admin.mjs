import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../src/models/User.js";

const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD are required.");
}

if (ADMIN_PASSWORD.length < 12) {
  throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
}

await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

if (existing) {
  existing.role = "admin";
  existing.accountStatus = "active";
  existing.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  existing.name = ADMIN_NAME || existing.name || "Workiffy Admin";
  await existing.save();
  console.log(`Updated admin: ${existing.email}`);
} else {
  const admin = await User.create({
    name: ADMIN_NAME || "Workiffy Admin",
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: "admin",
    accountStatus: "active"
  });
  console.log(`Created admin: ${admin.email}`);
}

await mongoose.disconnect();
