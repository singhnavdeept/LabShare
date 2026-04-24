import { Response } from 'express';
import { Equipment } from '../models/Equipment.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const equipmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  department: z.string().min(2),
  status: z.enum(['available', 'maintenance', 'retired']).default('available'),
  usageRules: z.string().optional(),
  category: z.enum(['Lab', 'Compute', 'Room', 'Electronics', 'Fabrication']).default('Lab'),
  totalQuantity: z.number().int().min(1).default(1),
  availableQuantity: z.number().int().min(0).default(1),
  bookingType: z.enum(['exclusive', 'multiple']).default('exclusive'),
  location: z.string().optional(),
  condition: z.enum(['Good', 'Maintenance', 'Limited']).default('Good'),
});

export const getEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.department) filters.department = req.query.department;
    if (req.query.status) filters.status = req.query.status;
    const equipment = await Equipment.find(filters).sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const data = equipmentSchema.parse(req.body);
    if (req.user?.role === 'manager') {
      data.department = req.user.department;
    }
    const eq = new Equipment(data);
    await eq.save();
    res.status(201).json(eq);
  } catch (error: any) {
    res.status(400).json({ error: 'Validation error', details: error.errors || error.message });
  }
};

export const updateEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const data = equipmentSchema.parse(req.body);
    const eq = await Equipment.findById(req.params.id);
    if (!eq) return res.status(404).json({ error: 'Not found' });
    
    if (req.user?.role === 'manager' && eq.department !== req.user.department) {
      return res.status(403).json({ error: 'Cannot manage equipment for other departments' });
    }

    Object.assign(eq, data);
    await eq.save();
    res.json(eq);
  } catch (error: any) {
    res.status(400).json({ error: 'Validation error', details: error.errors || error.message });
  }
};

export const deleteEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const eq = await Equipment.findById(req.params.id);
    if (!eq) return res.status(404).json({ error: 'Not found' });
    
    if (req.user?.role === 'manager' && eq.department !== req.user.department) {
      return res.status(403).json({ error: 'Cannot manage equipment for other departments' });
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
