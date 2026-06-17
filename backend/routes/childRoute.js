import express from 'express';
import {createChild, getChild, editChild, deleteChild, saveUsageTime} from "../controllers/childControllers.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

console.log("🔥 ROUTE FILE LOADED:", __filename);

router.get("/:id", getChild);
router.post("/", createChild);
router.patch("/:id", editChild);
router.patch('/:id/usage', saveUsageTime); 
router.delete("/:id", deleteChild);

export default router;