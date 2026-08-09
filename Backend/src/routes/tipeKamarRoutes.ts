import { Router } from 'express';
import { 
  getTipeKamarByProperti, 
  getTipeKamarById, 
  createTipeKamar, 
  updateTipeKamar, 
  deleteTipeKamar, 
  createTipeKamarSchema, 
  updateTipeKamarSchema 
} from '../controllers/tipeKamarController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.get('/properti/:propertiId', getTipeKamarByProperti);
router.get('/:id', getTipeKamarById);

// Endpoint dilindungi (hanya ADMIN atau TUAN_RUMAH)
router.use(protect, authorize('ADMIN', 'TUAN_RUMAH'));

router.post('/', validate(createTipeKamarSchema), createTipeKamar);
router.patch('/:id', validate(updateTipeKamarSchema), updateTipeKamar);
router.delete('/:id', deleteTipeKamar);

export default router;
