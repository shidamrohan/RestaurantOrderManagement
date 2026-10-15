import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Customer order routes (require authentication)
router.post('/', isAuthenticated, createOrder);
router.get('/my-orders', isAuthenticated, getMyOrders);

// Staff and Admin order management
router.get('/', isAuthenticated, authorizeRoles('staff', 'admin'), getAllOrders);
router.patch(
  '/:id/status',
  isAuthenticated,
  authorizeRoles('staff', 'admin'),
  updateOrderStatus
);

// Single order view (Customer owner or Staff/Admin)
router.get('/:id', isAuthenticated, getOrderById);

export default router;
