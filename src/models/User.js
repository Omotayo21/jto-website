import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
