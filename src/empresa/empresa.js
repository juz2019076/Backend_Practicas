// Modelo para InfoEmpresarial

import mongoose, { Schema } from 'mongoose';

const InfoEmpresarialSchema =  mongoose.Schema({
    Id_empleado: {
        type: String,
        required: [true, 'El ID del empleado es obligatorio'],
    },
    Codigo_personal: {
        type: String,
        required: [true, 'El código personal es obligatorio'],
    },
    Fecha_contratacion: {
        type: Date,
        required: [true, 'La fecha de contratación es obligatoria'],
    },
    Fecha_cargo: {
        type: Date,
        required: [true, 'La fecha de cargo es obligatoria'],
    },
    Cargo: {
        type: String,
        required: [true, 'El cargo es obligatorio'],
    },
    Sueldo: {
        type: String,
        required: [true, 'El sueldo es obligatorio'],
    },
    Descripcion_responsabilidades: {
        type: String,
        required: [true, 'La descripción de responsabilidades es obligatoria'],
    },
    Personal_cargo: {
        type: Number,
        required: [true, 'El número de personal a cargo es obligatorio'],
    },
    Jefe_inmediato: {
        type: String,
        required: [true, 'El jefe inmediato es obligatorio'],
    },
    Estado: {
        type: String,
        enum: ['Alta', 'Baja', 'Activo', 'De Baja'],
        required: [true, 'El estado es obligatorio'],
    }, 
    fecha_de_registro: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('Empresa', InfoEmpresarialSchema);
