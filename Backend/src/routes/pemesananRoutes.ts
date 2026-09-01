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
  getTiketByNomor,
  getPemesananById,
  checkAvailability
} from '../controllers/pemesananController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.post('/check-availability', checkAvailability);

// Semua endpoint pemesanan harus login
router.use(protect);

// Endpoint untuk TAMU
router.post('/', authorize('GUEST'), validate(createPemesananSchema), createPemesanan);
router.get('/my-bookings', authorize('GUEST'), getMyBookings);
router.get('/:id', authorize('GUEST', 'HOST', 'ADMIN'), getPemesananById);

// Endpoint untuk TUAN RUMAH / ADMIN
router.get('/host/bookings', authorize('HOST', 'ADMIN'), getHostBookings);
router.patch('/:id/status', authorize('HOST', 'ADMIN'), validate(updateStatusPemesananSchema), updateBookingStatus);
router.post('/:id/check-in', authorize('HOST', 'ADMIN'), validate(checkInSchema), processPhysicalCheckIn);
router.post('/walk-in', authorize('HOST', 'ADMIN'), validate(createWalkInBookingSchema), createWalkInBooking);
router.get('/tiket/:nomor', authorize('HOST', 'ADMIN'), getTiketByNomor);

export default router;
