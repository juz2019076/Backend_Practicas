import  { Router } from "express";
import { check } from "express-validator";

import { personalGet } from "./personales.controller.js";

const router = Router();

router.get("/", personalGet);

export default router;