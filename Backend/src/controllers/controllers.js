import { z } from "zod";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ SIGNUP CONTROLLER
export async function signup(req, res) {
  try {
    const { username, email, password, role, roomNumber } = req.body;

    // 🧠 Log incoming data (for debugging)
    console.log("Signup Request Body:", req.body);

    // 🧩 Zod validation
    const schema = z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(15, "Username must not exceed 15 characters"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must not exceed 20 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
      role: z.enum(["student", "maintainer"]).optional(),
      roomNumber: z.string().optional(),
    });

    const result = schema.safeParse({ username, email, password, role, roomNumber });

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues,
      });
    }

    const validated = result.data;

    // 🚫 Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: validated.username }, { email: validated.email }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 🧾 Create user
    const newUser = new User({
      username: validated.username,
      email: validated.email,
      password: hashedPassword,
      role: validated.role || "student",
      roomNumber: validated.roomNumber || "",
    });

    await newUser.save();

    // 🔑 Generate token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        roomNumber: newUser.roomNumber,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signin(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
