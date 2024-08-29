import { model, Schema } from "mongoose";

// Definir el esquema del usuario
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tp_status: {
    type: Boolean,
    default: true,
  },

});

// Crear el modelo de usuario
const UserModel = model("User", UserSchema);

export default UserModel;