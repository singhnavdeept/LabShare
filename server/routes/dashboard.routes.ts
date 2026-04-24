import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getDashboardOverview } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/overview', authenticate, getDashboardOverview as express.RequestHandler);

export default router;
