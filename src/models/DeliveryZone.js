import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Island", "Mainland", "Outside Lagos", "Outside Nigeria"
  slug: { type: String, unique: true }, // generated from name in API
  fee: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
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

const DeliveryZone = mongoose.models.DeliveryZone || mongoose.model('DeliveryZone', deliveryZoneSchema);
export default DeliveryZone;
