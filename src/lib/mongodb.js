import mongoose from 'mongoose';
import '@/models/User';
import '@/models/Product';
import '@/models/Category';
import '@/models/Order';
import '@/models/Review';
import '@/models/Cart';
import '@/models/Newsletter';

// Use a cached connection to avoid creating new connections on every API call in Next.js
let cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
