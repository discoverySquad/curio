import express from 'express';
import { getParent, getParentChildren, createParent, editParent, deleteParent } from '../controllers/parentController.js';

const router = express.Router();

router.get('/:id', getParent);
router.get('/:id/children', getParentChildren);
router.post('/', createParent);
router.patch('/:id', editParent);
router.delete('/:id', deleteParent);

export default router;
