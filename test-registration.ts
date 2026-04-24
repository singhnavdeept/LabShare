import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './server/models/User.js';

dotenv.config();

async function testUserRegistration() {
  try {
    console.log("Connecting missing DB...");
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("DB connected successfully.");

    const email = `testuser_${Date.now()}@example.com`;
    console.log("Checking if user exists:", email);
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists.");
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    console.log("Saving new user...");
    const user = new User({
      name: "Test User",
      email,
      password: hashedPassword,
      department: "Test Dept",
      role: "researcher"
    });
    
    await user.save();
    console.log("User saved successfully! ID:", user._id);
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

testUserRegistration();
