import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authroutes.js";
import complaintRoutes from "./src/routes/Complaintroutes.js";
dotenv.config();
const app=express()
app.use(cors());
app.use(express.json())
connectDB();
app.use("/api/v1/auth", authRoutes);   
app.use("/api/v1/complaints", complaintRoutes);


const PORT=process.env.PORT ||5001
app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})