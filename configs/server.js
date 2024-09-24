import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import bcrypt from 'bcrypt';
import UserModel from '../src/usuarios/usuarios.js';

import empresaRoutes from "../src/empresa/empresa.routes.js";
import personalRoutes from "../src/personales/personales.routes.js";
import practicasRoutes from "../src/practica/practicas.routes.js";
import registroRoutes from "../src/registro/registro.routes.js";
import uploadRoutes from '../src/upload/upload.routes.js'; 
import loginRoutes from '../src/usuarios/login.routes.js'; 
import logUpdateRoutes from '../src/logUpdate/logUpdate.routes.js';


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.empresaPath = '/v1/empresa'
        this.personalPath = '/v1/personal'
        this.practicaPath = '/v1/practica'
        this.registroPath = '/v1/registro'
        this.uploadPath = '/v1/upload';
        this.usuariosPath = '/v1/usuarios';
        this.logUpdatePath = '/v1/logUpdate';

        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();

     
        const defaultEmail = "admin@example.com";
        const defaultPassword = "admin123";

        const existingUser = await UserModel.findOne({ email: defaultEmail });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            const newUser = new UserModel({ email: defaultEmail, password: hashedPassword });
            await newUser.save();
            console.log('Usuario predeterminado creado:', defaultEmail);
        } else {
            console.log('Usuario predeterminado ya existe:', defaultEmail);
        }
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.empresaPath, empresaRoutes);
        this.app.use(this.personalPath, personalRoutes);
        this.app.use(this.practicaPath, practicasRoutes);
        this.app.use(this.registroPath, registroRoutes);
        this.app.use(this.uploadPath, uploadRoutes);
        this.app.use(this.usuariosPath, loginRoutes);
        this.app.use(this.logUpdatePath, logUpdateRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutandose y escuchando al puerto', this.port)
        });
    }
}

export default Server;
