import { Router } from 'express';
import { register, login, registerSchema, loginSchema, getMe } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
