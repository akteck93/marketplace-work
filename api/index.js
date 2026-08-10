import app from "../src/server.js";
import { connectDB } from "../src/config/db.js";

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
