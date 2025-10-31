import { Router } from 'express';
import { signin, signout } from '../controllers/authController.js';

const router = Router();
router.post('/auth/signin', signin);
router.get('/auth/signout', signout);
export default router;