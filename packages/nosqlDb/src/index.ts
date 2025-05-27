import mongoose from 'mongoose'
import { User } from './model/userModel'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI || ""
console.log(MONGODB_URI)
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable.')
}

// Avoid multiple connections in dev (for hot-reloading frameworks like Next.js)
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`)
        return mongoose
      })
    } catch (error) {
      console.error('MongoDB connection error:', error)
      throw new Error('Failed to connect to MongoDB')
    }
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    console.error('❌ MongoDB final connection error:', error)
    throw error
  }
}
export { User }
