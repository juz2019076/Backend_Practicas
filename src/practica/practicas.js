// Modelo para InformacionPracticas
import mongoose, { Schema } from 'mongoose';
const InformacionPracticasSchema =  mongoose.Schema({
    Id_Asociado: {
        type: String,
        required: [true, 'El ID del practicante es obligatorio'],
    },
    Institucion_Colegio: {
        type: String,
        required: [true, 'La institución o colegio es obligatorio'],
    },
    Grado: {
        type: String,
        required: [true, 'El grado es obligatorio'],
    },
    Carrera: {
        type: String,
        required: [true, 'La carrera es obligatoria'],
    },
    Habilidades: {
        type: String,
        required: [true, 'Las habilidades son obligatorias'],
    },
    Número_De_Horas: {
        type: Number,
        required: [true, 'El número de horas es obligatorio'],
    },
    Fecha_De_inicio: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'],
    },
    Fecha_De_Finalización: {
        type: Date,
        required: [true, 'La fecha de finalización es obligatoria'],
    },
    Referido: {
        type: String,
        required: [true, 'El referido es obligatorio'],
    },
    Estado: {
        type: String,
        enum: ['Aceptado', 'Rechazado'],
        required: [true, 'El estado es obligatorio'],
    },
    action: {
        type: String,
        enum: ['Crear', 'Actualizar', 'Eliminar'],
        required: [true, 'La acción es obligatoria'],
    },
    fecha_de_registro: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Practicas', InformacionPracticasSchema);
