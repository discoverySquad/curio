import express from 'express';
import {createChild, getChild, editChild, deleteChild, saveUsageTime} from "../controllers/childControllers.js"

const router = express.Router();

router.get("/:id", getChild);
router.post("/", createChild);
router.patch("/:id", editChild);
router.patch('/:id/usage', saveUsageTime); 
router.delete("/:id", deleteChild);

export default router;