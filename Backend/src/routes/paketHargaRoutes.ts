import { Router } from 'express';
import { 
  getPaketHargaByTipeKamar, 
  getPaketHargaById, 
  createPaketHarga, 
  updatePaketHarga, 
  deletePaketHarga, 
  createPaketHargaSchema, 
  updatePaketHargaSchema 
} from '../controllers/paketHargaController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';

const router = Router();

// Endpoint publik
router.get('/kamar/:tipeKamarId', getPaketHargaByTipeKamar);
router.get('/:id', getPaketHargaById);

// Endpoint dilindungi (hanya ADMIN atau TUAN_RUMAH)
router.use(protect, authorize('ADMIN', 'TUAN_RUMAH'));

router.post('/', validate(createPaketHargaSchema), createPaketHarga);
router.patch('/:id', validate(updatePaketHargaSchema), updatePaketHarga);
router.delete('/:id', deletePaketHarga);

export default router;
