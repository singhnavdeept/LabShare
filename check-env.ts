import dotenv from 'dotenv';
dotenv.config();

console.log("Checking environment variables...");
if (!process.env.MONGODB_URI) {
  console.log("MONGODB_URI is MISSING. This is why registration fails (mongoose doesn't connect and buffers requests until timeout).");
} else {
  console.log("MONGODB_URI is present:", process.env.MONGODB_URI.substring(0, 20) + "...");
}
