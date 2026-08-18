import { Router } from 'express';
import { createUlasan, getUlasanByProperti, createUlasanSchema, getUlasanTerbaik } from '../controllers/ulasanController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint Publik
router.get('/terbaik', getUlasanTerbaik); // Endpoint untuk Landing Page
router.get('/properti/:propertiId', getUlasanByProperti);

// Endpoint dilindungi
router.use(protect);
router.post('/', authorize('TAMU'), validate(createUlasanSchema), createUlasan);

export default router;
