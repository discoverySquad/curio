import express from 'express';
import  {getParent, createParent, editParent, deleteParent} from '../controllers/parentController.js';

const router = express.Router();

// create parent account
router.get("/:id", getParent);
router.post("/", createParent);
router.patch("/:id",  editParent);
router.delete("/:id", deleteParent);

export default router;