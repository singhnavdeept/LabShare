import { Response } from 'express';
import { Equipment } from '../models/Equipment.js';
import { Request as RequestModel } from '../models/Request.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getDashboardOverview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    
    const totalEquipment = await Equipment.countDocuments();
    const availableEquipment = await Equipment.countDocuments({ status: 'available' });
    const myActiveBookings = await RequestModel.countDocuments({ userId, status: 'approved', endDate: { $gte: new Date() } });
    
    let pendingRequestsQuery: any = { status: 'pending' };
    if (role === 'researcher') {
       pendingRequestsQuery.userId = userId;
    } else if (role === 'manager') {
       const deptEqs = await Equipment.find({ department: req.user?.department }).select('_id');
       pendingRequestsQuery.equipmentId = { $in: deptEqs.map(e => e._id) };
    } else {
       // admin sees all pending
    }
    const pendingRequestsCount = await RequestModel.countDocuments(pendingRequestsQuery);

    let activityQuery: any = {};
    if (role === 'researcher') {
        activityQuery.userId = userId;
    } else if (role === 'manager') {
        const deptEqs = await Equipment.find({ department: req.user?.department }).select('_id');
        activityQuery.equipmentId = { $in: deptEqs.map(e => e._id) };
    }
    const recentActivity = await RequestModel.find(activityQuery)
        .sort({ updatedAt: -1 })
        .limit(6)
        .populate('equipmentId', 'name category')
        .populate('userId', 'name');

    const upcomingBookings = await RequestModel.find({ 
        userId, 
        status: { $in: ['approved', 'pending'] },
        endDate: { $gte: new Date() } 
    }).sort({ startDate: 1 })
      .limit(5)
      .populate('equipmentId', 'name location department category');

    res.json({
        stats: {
            totalEquipment,
            availableEquipment,
            myActiveBookings,
            pendingRequestsCount
        },
        recentActivity,
        upcomingBookings
    });

  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
}
