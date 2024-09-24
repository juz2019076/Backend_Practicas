import { Router } from "express";
import { usuarioGet } from "./logVista.controller.js"; 

const router = Router();


router.get("/", usuarioGet);

export default router;
