import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { getKetersediaan, toggleBlockDate } from '../controllers/ketersediaanController';

const router = express.Router();

// Get availability and block dates for a room type (monthly)
router.get('/tipe-kamar/:tipeKamarId', protect, authorize('HOST', 'STAFF'), getKetersediaan);

// Toggle block status for a specific date
router.post('/tipe-kamar/:tipeKamarId/toggle-block', protect, authorize('HOST', 'STAFF'), toggleBlockDate);

export default router;
