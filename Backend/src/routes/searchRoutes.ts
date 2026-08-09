import { Router } from 'express';
import { searchProperti } from '../controllers/searchController';

const router = Router();

// Endpoint Publik untuk Search
router.get('/', searchProperti);

export default router;
