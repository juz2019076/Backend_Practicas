// src/usuarios/login.controller.js
import UserModel from './usuarios.js';
import LoginLogModel from './loginLog.model.js';  // Importar el modelo LoginLog
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Inicio de sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        
        const loginLog = new LoginLogModel({
            email: email,
            loginTime: new Date(),
            ipAddress: req.ip,
            userId: user ? user._id : null
        });
        
        await loginLog.save();

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no está definido en las variables de entorno');
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Cierre de sesión
export const logout = async (req, res) => {
    const { userId } = req.body; // Supone que el client envía el userId o puede obtenerlo del token decodificado

    try {
        // Registrar el cierre de sesión
        const logoutLog = new LoginLogModel({
            userId: userId,
            email: req.body.email, // Supone que el client envía el email también
            loginTime: new Date(),
            ipAddress: req.ip,
            logoutTime: new Date()  // Se registra la hora de cierre de sesión
        });

        await logoutLog.save();

        res.json({ message: 'Sesión cerrada con éxito' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
