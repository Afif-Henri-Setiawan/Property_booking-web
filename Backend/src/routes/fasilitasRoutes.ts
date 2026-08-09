import { Router } from 'express';
import { 
  getAllFasilitas, 
  getFasilitasById, 
  createFasilitas, 
  updateFasilitas, 
  deleteFasilitas, 
  createFasilitasSchema, 
  updateFasilitasSchema 
} from '../controllers/fasilitasController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.get('/', getAllFasilitas);
router.get('/:id', getFasilitasById);

// Endpoint dilindungi (hanya ADMIN atau TUAN_RUMAH)
router.use(protect, authorize('ADMIN', 'TUAN_RUMAH'));

router.post('/', validate(createFasilitasSchema), createFasilitas);
router.patch('/:id', validate(updateFasilitasSchema), updateFasilitas);
router.delete('/:id', deleteFasilitas);

export default router;
