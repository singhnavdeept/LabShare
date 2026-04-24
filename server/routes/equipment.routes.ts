import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipment.controller.js';

const router = express.Router();

router.get('/', authenticate, getEquipment as express.RequestHandler);
router.post('/', authenticate, requireRole(['admin', 'manager']), createEquipment as express.RequestHandler);
router.put('/:id', authenticate, requireRole(['admin', 'manager']), updateEquipment as express.RequestHandler);
router.delete('/:id', authenticate, requireRole(['admin', 'manager']), deleteEquipment as express.RequestHandler);

export default router;
