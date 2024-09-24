import  { Router } from "express";
import { check } from "express-validator";

import { logUpdateGet } from "./logUpdate.controller.js";

const router = Router();

router.get("/", logUpdateGet);

export default router;