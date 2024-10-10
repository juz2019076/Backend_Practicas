import mongoose, { Schema } from 'mongoose';

const DtosPersonalesSchema = mongoose.Schema({

    Id_Asociado: {
        type: String,
    },

    Primer_Nombre: {
        type: String,
        required: [true, 'El primer nombre es obligatorio'],
    },
    Segundo_Nombre: {
        type: String,
    },
    Tercer_Nombre: {
        type: String,
    },
    Primer_Apellido: {
        type: String,
        required: [true, 'El primer apellido es obligatorio'],
    },
    Segundo_Apellido: {
        type: String,
    },
    Apellido_de_Casada: {
        type: String,
    },
    Fecha_de_Nac: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria'],
    },
    Lugar_de_Nac: {
        type: String,
    },
    Direccion_De_Domicilio: {
        type: String,
    },
    Numero_De_Celular: {
        type: String,
    },
    Numero_De_Casa: {
        type: String,
    },
    Correo_Electronico: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
    },
    Fecha_De_Registro: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Personales', DtosPersonalesSchema);


