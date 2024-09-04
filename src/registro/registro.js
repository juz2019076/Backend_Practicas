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
            },
            Usuario: {
                type: String,
            },
            Operacion: {
                type: String,
            },
            Nombre_Tabla: {
                type: String,
            },
            Id_Asociado: {
                type: String,
            },
            Detalles: {
                type: Schema.Types.Mixed, 
            },
            Fecha_de_Registro: {
                type: Date,
            }
        }
    ]
});

export default mongoose.model('Registro', RegistroSchema);
