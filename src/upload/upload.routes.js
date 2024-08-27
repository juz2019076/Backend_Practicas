import { Router } from 'express';
import { handleFileUpload } from './upload.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });  // Configuración de multer para almacenar archivos temporalmente

// Definir la ruta POST para cargar y procesar los archivos JSON
router.post('/', upload.array('files'), handleFileUpload);

export default router;
