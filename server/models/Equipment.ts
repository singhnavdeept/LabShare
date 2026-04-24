import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    status: { type: String, enum: ['available', 'maintenance', 'retired'], default: 'available' },
    usageRules: { type: String, default: '' },
    category: { type: String, enum: ['Lab', 'Compute', 'Room', 'Electronics', 'Fabrication'], default: 'Lab' },
    totalQuantity: { type: Number, default: 1 },
    availableQuantity: { type: Number, default: 1 },
    bookingType: { type: String, enum: ['exclusive', 'multiple'], default: 'exclusive' },
    location: { type: String, default: '' },
    condition: { type: String, enum: ['Good', 'Maintenance', 'Limited'], default: 'Good' },
  },
  { timestamps: true }
);

export const Equipment = mongoose.model('Equipment', equipmentSchema);
