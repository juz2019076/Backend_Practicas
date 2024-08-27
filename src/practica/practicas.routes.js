import  { Router } from "express";
import { check } from "express-validator";

import { practicaGet } from "./practicas.controller.js";

const router = Router();

router.get("/", practicaGet);

export default router;