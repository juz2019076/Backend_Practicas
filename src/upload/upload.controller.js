import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Registro from '../registro/registro.js';
import { fileURLToPath } from 'url';
import Personales from '../personales/personales.js';
import Practicas from '../practica/practicas.js';
import Empresa from '../empresa/empresa.js';
import LogUpdate from '../logUpdate/logUpdate.js';

const modelos = {
    'Dtos_Personales': Personales,
    'InformacionPracticas': Practicas,
    'InfoEmpresarial': Empresa,
    "Datos_Personales": Personales,
    'Informacion_Practicas': Practicas
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = async (req, res) => {
    try {
        const files = req.files;
        const checksumsDir = path.join(__dirname, '../checksums');

        // Leer todos los archivos .md5 en el directorio de checksums
        const md5Files = fs.readdirSync(checksumsDir).filter(file => file.endsWith('.md5'));

        const expectedChecksums = {};

        for (let md5File of md5Files) {
            const checksumData = fs.readFileSync(path.join(checksumsDir, md5File), 'utf8');
            const lines = checksumData.split('\n').filter(line => line.trim() !== '');

            for (let line of lines) {
                const [checksum, filename] = line.split(' ');
                if (filename) {
                    expectedChecksums[filename.trim()] = checksum.trim();
                    console.log(`Checksum esperado para ${filename.trim()}: ${checksum.trim()}`);
                }
            }
        }

        for (let file of files) {
            // Procesar solo archivos JSON
            if (path.extname(file.originalname) === '.md5') {
                console.log(`El archivo ${file.originalname} es un archivo .md5, se omite.`);
                continue;
            }

            if (path.extname(file.originalname) !== '.json') {
                const message = `El archivo ${file.originalname} no es un archivo JSON, omitiendo.`;
                console.log(message);
                return res.status(400).json({ message });
            }

            let fileContent;
            try {
                // Leer y verificar que el contenido es un JSON válido
                fileContent = fs.readFileSync(file.path, 'utf8');
                JSON.parse(fileContent);
            } catch (error) {
                const message = `El archivo ${file.originalname} no tiene un contenido JSON válido.`;
                console.log(message);
                return res.status(400).json({ message });
            }

            const md5sum = crypto.createHash('md5').update(fileContent).digest('hex');

            console.log(`MD5 Calculado para ${file.originalname}: ${md5sum}`);

            const originalChecksum = expectedChecksums[file.originalname];

            if (originalChecksum) {
                console.log(`Checksum original encontrado para ${file.originalname}: ${originalChecksum}`);
            } else {
                const message = `No se encontró un checksum para ${file.originalname} en los archivos .md5`;
                console.log(message);
                return res.status(400).json({ message });
            }

            if (originalChecksum !== md5sum) {
                const message = `El archivo ${file.originalname} está corrupto o no coincide con el checksum.`;
                console.log(message);
                return res.status(400).json({ message });
            }
            let logs;
            const parsedData = JSON.parse(fileContent);

            if (Array.isArray(parsedData)) {
                logs = parsedData;
            } else if (parsedData.data && Array.isArray(parsedData.data)) {
                logs = parsedData.data;
            } else {
                const message = `El formato del archivo ${file.originalname} no es válido.`;
                console.log(message);
                return res.status(400).json({ message });
            }

            for (let log of logs) {
                try {
                    if (!log.Fecha_de_Registro || !log.Detalles || !log.Id_Asociado ||
                        !log.Nombre_Tabla || !log.Operacion || !log.Usuario || !log.ID) {
                        throw new Error(`Faltan campos obligatorios en el registro: ${JSON.stringify(log)}`);
                    }
                    const Modelo = modelos[log.Nombre_Tabla];

                    if (!Modelo) {
                        const message = `No se encontró un modelo para la tabla ${log.Nombre_Tabla}.`;
                        console.log(message);
                        return res.status(400).json({ message });
                    }

                    switch (log.Operacion) {
                        case 'INSERT':
                            const nuevoRegistro = new Modelo(log.Detalles);
                            await nuevoRegistro.save();
                            console.log(`Datos insertados en la tabla ${log.Nombre_Tabla}`);
                            break;

                        case 'UPDATE':

                            let filter = {};

                            if ((log.Nombre_Tabla === 'InfoEmpresarial' || log.Nombre_Tabla === 'Empresa') && log.Detalles.Id_empleado) {
                                filter = { Id_empleado: log.Detalles.Id_empleado };
                            } else if ((log.Nombre_Tabla === 'InformacionPracticas' || log.Nombre_Tabla === 'Informacion_Practicas') && log.Detalles.Id_Practicante) {
                                filter = { Id_Practicante: log.Detalles.Id_Practicante };
                            } else if ((log.Nombre_Tabla === 'Dtos_Personales' || log.Nombre_Tabla === 'Datos_Personales') && log.Detalles.id_personal) {
                                filter = { id_personal: log.Detalles.id_personal };
                            } else {
                                const message = `No se encontró un identificador válido para actualizar en Detalles para la tabla ${log.Nombre_Tabla}.`;
                                console.log(message);
                                continue;
                            }


                            const existingRecord = await Modelo.findOne(filter);

                            if (!existingRecord) {
                                const message = `Registro no encontrado para actualización en la tabla ${log.Nombre_Tabla}`;
                                console.log(message);
                                return res.status(400).json({ message });
                            }

                            const cambios = [];
                            for (let key in log.Detalles) {
                                if (log.Detalles[key] !== existingRecord[key]) {
                                    cambios.push({
                                        campo: key,
                                        valor_anterior: existingRecord[key],
                                        valor_nuevo: log.Detalles[key]
                                    });
                                }
                            }

                            await Modelo.updateOne(filter, log.Detalles);
                            console.log(`Datos actualizados en la tabla ${log.Nombre_Tabla}`);

                            if (cambios.length > 0) {
                                const updateLog = new LogUpdate({
                                    Usuario: log.Usuario,
                                    Nombre_Tabla: log.Nombre_Tabla,
                                    Id_Asociado: log.Id_Asociado,
                                    Cambios: cambios
                                });

                                await updateLog.save();
                                console.log('Log de actualización guardado exitosamente');
                            } else {
                                console.log('No se detectaron cambios en los datos');
                            }

                            break;

                        case 'SELECT':
                            console.log(`Operación SELECT detectada, no se realiza ninguna acción.`);
                            break;

                        default:
                            const message = `Operación no soportada: ${log.Operacion}`;
                            console.log(message);
                            return res.status(400).json({ message });
                    }

                    const newRegistro = new Registro({
                        file: file.originalname,
                        fecha_creacion: new Date(),
                        md5: md5sum,
                        data: [{
                            ID: log.ID,
                            Usuario: log.Usuario,
                            Operacion: log.Operacion,
                            Nombre_Tabla: log.Nombre_Tabla,
                            Id_Asociado: log.Id_Asociado,
                            Detalles: log.Detalles,
                            Fecha_de_Registro: log.Fecha_de_Registro
                        }]
                    });

                    await newRegistro.save();

                    try {
                        const filePath = file.path;

                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        } else {
                            console.log(`Archivo ${filePath} no encontrado. No se puede eliminar.`);
                        }
                    } catch (error) {
                        console.error(`Error al intentar eliminar el archivo: ${error.message}`);
                    }

                } catch (error) {
                    console.error('Error al guardar el registro:', error.message);
                    return res.status(400).json({ message: error.message });
                }
            }
        }

        res.status(200).json({ message: 'Archivos procesados exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar los archivos.' });
    }
};