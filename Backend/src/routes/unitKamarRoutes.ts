import { Router } from 'express';
import { 
  getUnitKamarByTipeKamar, 
  createUnitKamar, 
  updateUnitKamar, 
  deleteUnitKamar,
  createBlokir,
  deleteBlokir,
  createUnitKamarSchema, 
  updateUnitKamarSchema,
  createBlokirSchema
} from '../controllers/unitKamarController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint dilindungi (hanya ADMIN atau TUAN_RUMAH)
router.use(protect, authorize('ADMIN', 'TUAN_RUMAH'));

// Unit Kamar Routes
router.get('/kamar/:tipeKamarId', getUnitKamarByTipeKamar);
router.post('/', validate(createUnitKamarSchema), createUnitKamar);
router.patch('/:id', validate(updateUnitKamarSchema), updateUnitKamar);
router.delete('/:id', deleteUnitKamar);

// Blokir Ketersediaan Routes
router.post('/blokir', validate(createBlokirSchema), createBlokir);
router.delete('/blokir/:id', deleteBlokir);

export default router;
