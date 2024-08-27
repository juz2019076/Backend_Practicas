import  { Router } from "express";
import { check } from "express-validator";

import { empresaGet } from "./empresa.controller";

const router = Router();

router.get("/", empresaGet);

export default router;