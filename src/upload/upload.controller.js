import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Registro from '../registro/registro.js';  // Modelo para almacenar los registros en la base de datos
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para manejar la carga y procesamiento de archivos JSON
export const handleFileUpload = async (req, res) => {
    try {
        const files = req.files;  // Obtener los archivos subidos
        const md5FilePath = path.join(__dirname, '../checksum.md5'); // Ruta del archivo de checksums MD5

        // Leer y dividir las líneas del archivo checksum.md5
        const checksumData = fs.readFileSync(md5FilePath, 'utf8');
        const expectedChecksums = checksumData.split('\n').filter(line => line.trim() !== '');

        // Iterar sobre cada archivo subido
        for (let file of files) {
            const fileContent = fs.readFileSync(file.path, 'utf8');

            // Verificar que el archivo sea un JSON válido
            try {
                JSON.parse(fileContent);
            } catch (error) {
                return res.status(400).json({ message: `El archivo ${file.originalname} no es un JSON válido.` });
            }

            // Calcular el MD5 del archivo
            const md5sum = crypto.createHash('md5').update(fileContent).digest('hex');
            const originalChecksum = expectedChecksums.find(line => line.includes(file.originalname));

            // Verificar que el archivo no esté corrupto comparando el MD5
            if (!originalChecksum || !originalChecksum.includes(md5sum)) {
                return res.status(400).json({ message: `El archivo ${file.originalname} está corrupto o no coincide con el checksum.` });
            }

            // Guardar los datos en la base de datos
            const jsonData = JSON.parse(fileContent);
            const newRegistro = new Registro({
                file: file.originalname,
                fecha_creacion: new Date(),
                md5: md5sum,
                data: jsonData
            });

            await newRegistro.save();  // Guardar el registro en MongoDB

            // Eliminar el archivo después de procesarlo para liberar espacio
            fs.unlinkSync(file.path);
        }

        res.status(200).json({ message: 'Archivos procesados exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar los archivos.' });
    }
};
