import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../controllers/menuItemController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Staff and Admin can toggle availability
router.patch(
  '/:id/availability',
  isAuthenticated,
  authorizeRoles('staff', 'admin'),
  toggleAvailability
);

// Admin-only management
router.post('/', isAuthenticated, authorizeRoles('admin'), createMenuItem);
router.put('/:id', isAuthenticated, authorizeRoles('admin'), updateMenuItem);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteMenuItem);

export default router;
