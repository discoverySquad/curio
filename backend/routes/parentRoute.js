import express from 'express';
import { getParent, getParentChildren, createParent, editParent, deleteParent, archiveParent } from '../controllers/parentController.js';

const router = express.Router();

router.get('/:id', getParent);
router.get('/:id/children', getParentChildren);
router.post('/', createParent);
router.patch('/:id', editParent);
router.patch('/:id/archive', archiveParent);
router.delete('/:id', deleteParent);

export default router;
