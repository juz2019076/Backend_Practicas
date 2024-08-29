import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Registro from '../registro/registro.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = async (req, res) => {
    try {
        const files = req.files;
        const md5FilePath = path.join(__dirname, '../2checksum.md5');

        // Leer el archivo checksum.md5
        const checksumData = fs.readFileSync(md5FilePath, 'utf8');
        const expectedChecksums = checksumData.split('\n').filter(line => line.trim() !== '');

        for (let file of files) {
            const fileContent = fs.readFileSync(file.path, 'utf8');

            // Verificar si el archivo es un JSON válido
            let jsonData;
            try {
                jsonData = JSON.parse(fileContent);
            } catch (error) {
                return res.status(400).json({ message: `El archivo ${file.originalname} no es un JSON válido.` });
            }

            // Calcular el MD5 del contenido del archivo
            const md5sum = crypto.createHash('md5').update(fileContent).digest('hex');

            // Debug: Mostrar el MD5 calculado
            console.log(`MD5 Calculado para ${file.originalname}: ${md5sum}`);

            // Buscar el checksum esperado para este archivo en checksum.md5
            const originalChecksum = expectedChecksums.find(line => line.includes(file.originalname));

            if (originalChecksum) {
                console.log(`Checksum original encontrado en el archivo para ${file.originalname}: ${originalChecksum}`);
            } else {
                console.log(`No se encontró un checksum para ${file.originalname} en el archivo checksum.md5`);
            }

            // Verificar si el checksum coincide
            if (!originalChecksum || !originalChecksum.includes(md5sum)) {
                return res.status(400).json({ message: `El archivo ${file.originalname} está corrupto o no coincide con el checksum.` });
            }

            // Crear un nuevo registro en la base de datos
            const newRegistro = new Registro({
                file: file.originalname,
                fecha_creacion: new Date(),
                md5: md5sum,
                data: jsonData
            });

            // Guardar el registro en la base de datos
            await newRegistro.save();

            // Eliminar el archivo subido temporalmente
            fs.unlinkSync(file.path);
        }

        // Responder con éxito
        res.status(200).json({ message: 'Archivos procesados exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar los archivos.' });
    }
};
