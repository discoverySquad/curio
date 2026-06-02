import express from "express";

import {getSingedUrlFile} from "../controllers/uploadController.js";

const router = express.Router();

router.get("/signed-url/*key", getSingedUrlFile);

export default router;