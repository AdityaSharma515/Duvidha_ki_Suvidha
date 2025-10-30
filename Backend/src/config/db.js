import mongoose from "mongoose";

export const connectDB=async ()=>{
    try {
        const url=process.env.MONGO_URL
        if (!url) {
            throw new Error("MONGO_URL not found in enviroment variables")    
        }
        await mongoose.connect(url,{
            dbName:"Duvidha_ki_Suvidha",
        });

        console.log("MongoDb Connected Succefully")
    } catch (error) {
        console.error("Error connecting MongoDb",error);
        process.exit(1);
    }

}