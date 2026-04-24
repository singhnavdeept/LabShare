import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('MONGODB_URI not found in env. Running in memory/mock mode disabled. API routes will fail if they require DB.');
      global.dbConnected = false;
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    global.dbConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    global.dbConnected = false;
  }
};
