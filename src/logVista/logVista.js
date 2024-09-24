import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
    Usuario: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
    },
    Pagina: {
        type: String,
        required: [true, 'La página es obligatoria'],
    },
    fecha_de_registro: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model('Usuario', UsuarioSchema);
