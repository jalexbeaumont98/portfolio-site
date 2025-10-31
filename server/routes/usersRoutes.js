import { Router } from 'express';
import { getAll, getById, createOne, updateById, removeById, removeAll } from '../controllers/usersController.js';

const router = Router();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createOne);
router.put('/:id', updateById);
router.delete('/:id', removeById);
router.delete('/', removeAll);

export default router;