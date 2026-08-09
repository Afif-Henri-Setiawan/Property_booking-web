import { Router } from 'express';
import { createUlasan, getUlasanByProperti, createUlasanSchema } from '../controllers/ulasanController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint Publik
router.get('/properti/:propertiId', getUlasanByProperti);

// Endpoint dilindungi
router.use(protect);
router.post('/', authorize('TAMU'), validate(createUlasanSchema), createUlasan);

export default router;
