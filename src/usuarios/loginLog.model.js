
import { model, Schema } from "mongoose";


const LoginLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    logoutTime:{
        type: Date,
    },
    ipAddress: {
        type: String,
    }
});


const LoginLogModel = model("LoginLog", LoginLogSchema);

export default LoginLogModel;
