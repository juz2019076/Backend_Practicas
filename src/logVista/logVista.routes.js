import { Router } from "express";
import { check } from "express-validator";
import { logVistaGet, postLogVista } from "./logVista.controller.js";

const router = Router();


router.get("/", logVistaGet);

router.post("/", [
    check("usuario", "I need usuario").not().isEmpty(),
    check("pagina", "I need pagina").not().isEmpty(),
], postLogVista)

export default router;
