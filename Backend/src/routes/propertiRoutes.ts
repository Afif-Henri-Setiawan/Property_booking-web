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
  verifyPropertySchema
} from '../controllers/propertiController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.get('/', getPropertiPublik);
router.get('/:id', getPropertiById);

// Endpoint Admin Khusus
router.get('/pending', protect, authorize('ADMIN'), getPendingProperties);
router.patch('/:id/verifikasi', protect, authorize('ADMIN'), validate(verifyPropertySchema), verifyProperty);

// Endpoint dilindungi
router.use(protect);

// Host bisa melihat propertinya sendiri
router.get('/host/my-properties', authorize('TUAN_RUMAH', 'ADMIN'), getMyProperti);

// Manajemen properti (Hanya Host / Admin)
router.post('/', authorize('TUAN_RUMAH', 'ADMIN'), validate(createPropertiSchema), createProperti);
router.patch('/:id', authorize('TUAN_RUMAH', 'ADMIN'), validate(updatePropertiSchema), updateProperti);
router.delete('/:id', authorize('TUAN_RUMAH', 'ADMIN'), deleteProperti);

export default router;
