import { Router } from 'express';
import { 
  getAllTipeProperti, 
  getTipePropertiById, 
  createTipeProperti, 
  updateTipeProperti, 
  deleteTipeProperti, 
  createTipePropertiSchema, 
  updateTipePropertiSchema 
} from '../controllers/tipePropertiController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.get('/', getAllTipeProperti);
router.get('/:id', getTipePropertiById);

// Endpoint dilindungi (hanya ADMIN atau TUAN_RUMAH)
router.use(protect, authorize('ADMIN', 'TUAN_RUMAH'));

router.post('/', validate(createTipePropertiSchema), createTipeProperti);
router.patch('/:id', validate(updateTipePropertiSchema), updateTipeProperti);
router.delete('/:id', deleteTipeProperti);

export default router;
