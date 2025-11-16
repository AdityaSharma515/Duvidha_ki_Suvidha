import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cors from "cors"
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authroutes.js";
import complaintRoutes from "./src/routes/Complaintroutes.js";

const app = express()

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", (req, res) => res.sendStatus(200));

app.use(express.json());

// MOVE DB CONNECT BELOW ALL MIDDLEWARE
await connectDB(); // if using top-level await
// OR
// connectDB().catch(err => console.log(err));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
