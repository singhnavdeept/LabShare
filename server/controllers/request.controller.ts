import { Response } from 'express';
import { Request as RequestModel } from '../models/Request.js';
import { Equipment } from '../models/Equipment.js';
import { UsageLog } from '../models/UsageLog.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const requestSchema = z.object({
  equipmentId: z.string(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  purpose: z.string().min(5),
});

export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    let query: any = {};
    if (req.user?.role === 'researcher') {
      query.userId = req.user.userId;
    } else if (req.user?.role === 'manager') {
      const deptEqs = await Equipment.find({ department: req.user.department }).select('_id');
      const eqIds = deptEqs.map(eq => eq._id);
      query.equipmentId = { $in: eqIds };
    }
    
    const requests = await RequestModel.find(query).populate('equipmentId').populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const data = requestSchema.parse(req.body);
    
    if (data.startDate >= data.endDate) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const eq = await Equipment.findById(data.equipmentId);
    if (!eq) return res.status(404).json({ error: 'Equipment not found' });
    if (eq.status !== 'available') {
      return res.status(400).json({ error: 'Equipment is currently not available' });
    }

    const overlapping = await RequestModel.find({
      equipmentId: data.equipmentId,
      status: { $in: ['approved'] },
      $or: [
        { startDate: { $lt: data.endDate }, endDate: { $gt: data.startDate } }
      ]
    });

    if (eq.bookingType === 'exclusive' && overlapping.length >= eq.totalQuantity) {
      return res.status(409).json({ error: 'Scheduling conflict: Equipment is fully booked for this time period.' });
    }

    const newReq = new RequestModel({ ...data, userId: req.user?.userId, status: 'pending' });
    await newReq.save();
    res.status(201).json(newReq);
  } catch (error: any) {
    res.status(400).json({ error: 'Validation error', details: error.errors || error.message });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, managerNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const r = await RequestModel.findById(req.params.id).populate('equipmentId');
    if (!r) return res.status(404).json({ error: 'Request not found' });

    const eq: any = r.equipmentId;
    if (req.user?.role === 'manager' && eq.department !== req.user?.department) {
      return res.status(403).json({ error: 'Cannot manage requests for other departments' });
    }

    if (r.status !== 'pending') {
       return res.status(400).json({ error: 'Request is already processed' });
    }

    if (status === 'approved') {
      const overlapping = await RequestModel.find({
        equipmentId: r.equipmentId,
        status: 'approved',
        $or: [
          { startDate: { $lt: r.endDate }, endDate: { $gt: r.startDate } }
        ]
      });
      if (eq.bookingType === 'exclusive' && overlapping.length >= eq.totalQuantity) {
        return res.status(409).json({ error: 'Scheduling conflict: Equipment got fully booked in the interim.' });
      }
    }

    r.status = status;
    if (managerNotes) r.managerNotes = managerNotes;
    await r.save();

    if (status === 'approved') {
      const log = new UsageLog({
        requestId: r._id,
        equipmentId: r.equipmentId,
        userId: r.userId,
        startTime: r.startDate,
        endTime: r.endDate,
        status: 'scheduled'
      });
      await log.save();
    }

    res.json(r);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
