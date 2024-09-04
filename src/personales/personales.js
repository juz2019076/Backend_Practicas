import mongoose, { Schema } from 'mongoose';

const DtosPersonalesSchema = mongoose.Schema({

    id_personal: {
        type: String,
        required: [true, 'La id asignada es obligatoria']
    },

    primer_nombre: {
        type: String,
        required: [true, 'El primer nombre es obligatorio'],
    },
    segundo_nombre: {
        type: String,
    },
    tercer_nombre: {
        type: String,
    },
    primer_apellido: {
        type: String,
        required: [true, 'El primer apellido es obligatorio'],
    },
    segundo_apellido: {
        type: String,
    },
    apellido_de_casada: {
        type: String,
    },
    fecha_de_nac: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria'],
    },
    lugar_de_nac: {
        type: String,
        required: [true, 'El lugar de nacimiento es obligatorio'],
    },
    direccion_domicilio: {
        type: String,
        required: [true, 'La dirección de domicilio es obligatoria'],
    },
    numero_celular: {
        type: String,
        required: [true, 'El número de celular es obligatorio'],
    },
    numero_casa: {
        type: String,
    },
    correo_electronico: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
    },
    action: {
        type: String,
        enum: ['Crear', 'Actualizar', 'Eliminar'],
        required: [true, 'La acción es obligatoria'],
    },
    fecha_de_registro: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Personales', DtosPersonalesSchema);


