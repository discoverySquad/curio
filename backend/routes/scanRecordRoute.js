import express from "express";
import { getTodayMissionCount } from "../controllers/scanRecordController.js";

const router = express.Router();

router.get("/today/:childId", getTodayMissionCount);

export default router;