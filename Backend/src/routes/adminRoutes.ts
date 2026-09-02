import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/adminController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Semua rute admin harus dilindungi dan hanya dapat diakses oleh ADMIN
router.use(protect, authorize('ADMIN'));

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;
