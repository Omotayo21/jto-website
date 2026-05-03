import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Island", "Mainland", "USA", "UK"
  slug: { type: String, unique: true }, // generated from name in API
  type: { type: String, enum: ['domestic', 'international'], default: 'domestic' },
  country: { type: String }, // For international zones, e.g. "USA", "UK", "Canada"
  fee: { type: Number, required: true },  // NGN fee for domestic
  feeUSD: { type: Number, default: 0 },   // USD fee for international
  estimatedDays: String,   // e.g. "2-3 business days"
  active: { type: Boolean, default: true },
  // Time-limited pricing — admin can override fee for a period
  pricingOverride: {
    fee: Number,
    validFrom: Date,
    validUntil: Date,
    active: { type: Boolean, default: false }
  },
}, {
  timestamps: true,
});

// Check if model exists and if so, delete it to ensure the new schema is applied
if (mongoose.models.DeliveryZone) {
  delete mongoose.models.DeliveryZone;
}

const DeliveryZone = mongoose.model('DeliveryZone', deliveryZoneSchema);
export default DeliveryZone;

