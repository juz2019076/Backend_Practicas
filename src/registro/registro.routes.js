import  { Router } from "express";
import { check } from "express-validator";

import { registroGet } from "./registro.controller.js";

const router = Router();

router.get("/", registroGet);

export default router;