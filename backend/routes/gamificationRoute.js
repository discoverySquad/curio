import express from "express";
import { completeTask, completeScan, viewFact, getChildGamification } from "../controllers/gamificationControllers.js";

const router = express.Router();

router.get("/:id", getChildGamification);
router.post('/task', completeTask);
router.post('/scan', completeScan);
router.post('/fact', viewFact);

export default router;