import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
        default: null // Token to verify the password reset request
    },
    resetPasswordExpiry: {
        type: Date,
        default: null // Expiry time for the reset token
    },
    // address: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address'
    // }],
    cartData : {
        type: Object,
        default: {}  
    }
    
}, { timestamps: true, minimize: false });

export const User = mongoose.model('User', userSchema);
