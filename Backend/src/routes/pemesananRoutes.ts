import { Router } from 'express';
import { 
  createPemesanan, 
  getMyBookings, 
  getHostBookings, 
  updateBookingStatus, 
  createPemesananSchema,
  updateStatusPemesananSchema,
  checkInSchema,
  processPhysicalCheckIn,
  createWalkInBookingSchema,
  createWalkInBooking,
  getTiketByNomor
} from '../controllers/pemesananController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Semua endpoint pemesanan harus login
router.use(protect);

// Endpoint untuk TAMU
router.post('/', authorize('TAMU'), validate(createPemesananSchema), createPemesanan);
router.get('/my-bookings', authorize('TAMU'), getMyBookings);

// Endpoint untuk TUAN RUMAH / ADMIN
router.get('/host/bookings', authorize('TUAN_RUMAH', 'ADMIN'), getHostBookings);
router.patch('/:id/status', authorize('TUAN_RUMAH', 'ADMIN'), validate(updateStatusPemesananSchema), updateBookingStatus);
router.post('/:id/check-in', authorize('TUAN_RUMAH', 'ADMIN'), validate(checkInSchema), processPhysicalCheckIn);
router.post('/walk-in', authorize('TUAN_RUMAH', 'ADMIN'), validate(createWalkInBookingSchema), createWalkInBooking);
router.get('/tiket/:nomor', authorize('TUAN_RUMAH', 'ADMIN'), getTiketByNomor);

export default router;
