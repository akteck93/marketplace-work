import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("bufferCommands", true);

let isConnected = false;

export async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 0
    });
    isConnected = true;
    console.log("[MongoDB] connected");
  } catch (error) {
    console.warn("[MongoDB] Connection warning:", error.message);
  }

  return mongoose.connection;
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
