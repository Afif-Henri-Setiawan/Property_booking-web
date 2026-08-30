import { Router } from 'express';
import { 
  getAllTipeKasur, 
  getTipeKasurById, 
  createTipeKasur, 
  updateTipeKasur, 
  deleteTipeKasur, 
  createTipeKasurSchema, 
  updateTipeKasurSchema 
} from '../controllers/tipeKasurController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.get('/', getAllTipeKasur);
router.get('/:id', getTipeKasurById);

// Endpoint dilindungi (hanya ADMIN atau TUAN_RUMAH)
router.use(protect, authorize('ADMIN', 'HOST'));

router.post('/', validate(createTipeKasurSchema), createTipeKasur);
router.patch('/:id', validate(updateTipeKasurSchema), updateTipeKasur);
router.delete('/:id', deleteTipeKasur);

export default router;
