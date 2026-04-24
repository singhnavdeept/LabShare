import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getRequests, createRequest, updateRequestStatus } from '../controllers/request.controller.js';
import { UsageLog } from '../models/UsageLog.js';

const router = express.Router();

router.get('/', authenticate, getRequests as express.RequestHandler);
router.post('/', authenticate, createRequest as express.RequestHandler);
router.put('/:id/status', authenticate, requireRole(['admin', 'manager']), updateRequestStatus as express.RequestHandler);

// Usage logs (read only)
router.get('/usage', authenticate, async (req: AuthRequest, res) => {
  try {
    const logs = await UsageLog.find().populate('equipmentId', 'name').populate('userId', 'name').sort({ startTime: -1 });
    res.json(logs);
  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
