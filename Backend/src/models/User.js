import mongoose,{Schema} from "mongoose";

const UserSchema=new Schema({
    username:{type:String ,required:true,unique:true},
    password:{type:String,required:true},
    role: {
        type: String,
        enum: ["student", "maintainer"],
        default: "student",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roomNumber: {
        type: String,
    },
    }, { timestamps: true})

const users=mongoose.model("User",UserSchema);

export default users;