import { Router } from 'express';
import { 
  getMyProperti, 
  getPropertiPublik, 
  getPropertiById, 
  createProperti, 
  updateProperti, 
  deleteProperti, 
  createPropertiSchema, 
  updatePropertiSchema,
  getPendingProperties,
  verifyProperty,
  verifyPropertySchema,
  getHostDashboard
} from '../controllers/propertiController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';
import { 
  getPropertyStaff, 
  addPropertyStaff, 
  removePropertyStaff, 
  addStaffSchema 
} from '../controllers/propertiStaffController';

const router = Router();

// Endpoint publik (Landing Page / Pencarian Umum)
router.get('/', getPropertiPublik);

// Endpoint Admin Khusus
router.get('/pending', protect, authorize('ADMIN'), getPendingProperties);
router.patch('/:id/verifikasi', protect, authorize('ADMIN'), validate(verifyPropertySchema), verifyProperty);

// Endpoint dilindungi
router.use(protect);
router.get('/host/dashboard', authorize('HOST', 'ADMIN'), getHostDashboard);
router.get('/host/my-properties', authorize('HOST', 'ADMIN'), getMyProperti);

// Manajemen properti (Hanya Host / Admin)
router.post('/', authorize('HOST', 'ADMIN'), validate(createPropertiSchema), createProperti);

// Dynamic routes (Taruh di bawah agar tidak konflik dengan /pending atau /host/dashboard)
router.get('/:id', getPropertiById);
router.patch('/:id', authorize('HOST', 'ADMIN'), validate(updatePropertiSchema), updateProperti);
router.delete('/:id', authorize('HOST', 'ADMIN'), deleteProperti);

// Manajemen Staf Properti
router.get('/:propertiId/staff', authorize('HOST', 'ADMIN'), getPropertyStaff);
router.post('/:propertiId/staff', authorize('HOST', 'ADMIN'), validate(addStaffSchema), addPropertyStaff);
router.delete('/:propertiId/staff/:staffId', authorize('HOST', 'ADMIN'), removePropertyStaff);

export default router;
