import mongoose from 'mongoose';

const LogVistaSchema = new mongoose.Schema({

    usuario: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
    },
    pagina: {
        type: String,
        required: [true, 'La página es obligatoria'],
    },
    fecha_de_registro: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model('Logvista', LogVistaSchema);
