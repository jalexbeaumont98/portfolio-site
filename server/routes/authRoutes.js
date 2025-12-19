import { Router } from 'express';
import { signin, signout } from '../controllers/authController.js';
import { create as registerUser } from '../controllers/usersController.js';

const router = Router();
router.post('/signin', signin);
router.get('/signout', signout);
router.post('/signup', registerUser);
export default router;