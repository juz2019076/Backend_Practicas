import mongoose, { Schema } from 'mongoose';

const RegistroSchema =  mongoose.Schema({
    file: {
        type: String,
        required: [true, 'El nombre del archivo es obligatorio'],
    },
    fecha_creacion: {
        type: Date,
        required: [true, 'La fecha de creación es obligatoria'],
    },
    md5:{
        type:String,
        required:[true]
    },
    data: [
        {
            ID: {
                type: String,
                required: [true, 'El ID es obligatorio'],
            },
            Usuario: {
                type: String,
                required: [true, 'El usuario es obligatorio'],
            },
            Operacion: {
                type: String,
                required: [true, 'La operación es obligatoria'],
            },
            Nombre_Tabla: {
                type: String,
                required: [true, 'El nombre de la tabla es obligatorio'],
            },
            Id_Asociado: {
                type: String,
                required: [true, 'El ID asociado es obligatorio'],
            },
            Detalles: {
                type: Schema.Types.Mixed, // Esto te permitirá usar los diferentes esquemas en este campo.
                required: [true, 'Los detalles son obligatorios'],
            },
            Fecha_de_Registro: {
                type: Date,
                required: [true, 'La fecha de registro es obligatoria'],
            }
        }
    ]
});

export default mongoose.model('Registro', RegistroSchema);
