import { Router } from 'express';
import { buatPembayaran, webhookPembayaran, webhookSchema, syncStatusPembayaran } from '../controllers/pembayaranController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint Publik untuk Webhook Midtrans
router.post('/webhook', validate(webhookSchema), webhookPembayaran);

// Endpoint dilindungi
router.use(protect);
router.post('/:pemesananId', authorize('TAMU'), buatPembayaran);
router.get('/:pemesananId/sync', authorize('TAMU', 'TUAN_RUMAH', 'ADMIN'), syncStatusPembayaran);

export default router;
