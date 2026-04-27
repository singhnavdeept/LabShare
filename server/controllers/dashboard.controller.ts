import { Response } from 'express';
import { Equipment } from '../models/Equipment.js';
import { Request as RequestModel } from '../models/Request.js';
import { UsageLog } from '../models/UsageLog.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getDashboardOverview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    
    // ... stats, activity, bookings ...
    const totalEquipment = await Equipment.countDocuments();
    const availableEquipment = await Equipment.countDocuments({ status: 'available' });
    const myActiveBookings = await RequestModel.countDocuments({ userId, status: 'approved', endDate: { $gte: new Date() } });
    
    let pendingRequestsQuery: any = { status: 'pending' };
    let activityQuery: any = {};
    let analyticsMatchQuery: any = { status: 'approved' };

    if (role === 'researcher') {
       pendingRequestsQuery.userId = userId;
       activityQuery.userId = userId;
       analyticsMatchQuery.userId = userId;
    } else if (role === 'manager') {
       const deptEqs = await Equipment.find({ department: req.user?.department }).select('_id');
       const eqIds = deptEqs.map(e => e._id);
       pendingRequestsQuery.equipmentId = { $in: eqIds };
       activityQuery.equipmentId = { $in: eqIds };
       analyticsMatchQuery.equipmentId = { $in: eqIds };
    }
    
    const pendingRequestsCount = await RequestModel.countDocuments(pendingRequestsQuery);

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

    // Aggregate usage analytics
    const usageAnalytics = await RequestModel.aggregate([
      { $match: analyticsMatchQuery },
      { $lookup: { from: 'equipment', localField: 'equipmentId', foreignField: '_id', as: 'eq' } },
      { $unwind: '$eq' },
      { $group: { _id: '$eq.name', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 7 }
    ]);

    res.json({
        stats: {
            totalEquipment,
            availableEquipment,
            myActiveBookings,
            pendingRequestsCount
        },
        recentActivity,
        upcomingBookings,
        usageAnalytics
    });

  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
}
