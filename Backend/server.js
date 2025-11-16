import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cors from "cors"
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authroutes.js";
import complaintRoutes from "./src/routes/Complaintroutes.js";
const app = express()
app.use(cors());
app.use(express.json())
connectDB();
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.get("/", (req, res) => { //check health
    res.status(200).send("ok");
});

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})