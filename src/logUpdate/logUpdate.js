import mongoose from 'mongoose';

const updateLogSchema = new mongoose.Schema({
    Usuario: { 
        type: String, 
        required: true },

    Nombre_Tabla: { 
        type: String, 
        required: true },

    Id_Asociado: { 
        type: String, 
        required: true },

    Fecha_de_Registro: { 
        type: Date, 
        default: Date.now },

    Cambios: [{
        campo: String,
        valor_anterior: mongoose.Schema.Types.Mixed,
        valor_nuevo: mongoose.Schema.Types.Mixed
    }]
});

export default mongoose.model('UpdateLog', updateLogSchema);
