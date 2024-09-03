import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';

import empresaRoutes from "../src/empresa/empresa.routes.js";
import personalRoutes from "../src/personales/personales.routes.js";
import practicasRoutes from "../src/practica/practicas.routes.js";
import registroRoutes from "../src/registro/registro.routes.js";
import updloadRoutes from "../src/upload/upload.routes.js";

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.empresaPath = '/v1/empresa'
        this.personalPath = '/v1/personal'
        this.practicaPath = '/v1/practica'
        this.registroPath = '/v1/registro'
        this.updloadPath = '/v1/updload'


        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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
        this.app.use(this.updloadPath, updloadRoutes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutandose y escuchando al puerto', this.port)
        });
    }
}

export default Server;