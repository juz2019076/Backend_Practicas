// src/usuarios/login.routes.js
import { Router } from 'express';
import { login, logout } from './login.controller.js';  // Importar logout aquí
import { body, validationResult } from 'express-validator';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

router.post('/logout', logout);  // Ahora logout está definido

export default router;
