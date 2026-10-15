import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-protected routes
router.post('/', isAuthenticated, authorizeRoles('admin'), createCategory);
router.put('/:id', isAuthenticated, authorizeRoles('admin'), updateCategory);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteCategory);

export default router;
