import { Router } from 'express';
import { handleFileUpload } from './upload.controller.js';
import multer from 'multer';


const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/',
    upload.array('files'),
    handleFileUpload
);

export default router;
