import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const register = async (req,res) => {
    try {
        const { fullName, email, password } = req.body;
        
        if(!fullName || !email || !password ) {
            return res.status(400).json({ 
                message: 'All fields are required', 
                success: false    
            });
        }
        

        const existingUser = await User.findOne({ email });     
        if(existingUser){
            return res.status(400).json({
                message: 'Email already exists',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName, 
            email, 
            password: hashedPassword
        });
        return res.status(201).json({
            message: 'User registered successfully',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to register user',
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email ||!password) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }
        
        const tokenData = {
            userId: user._id,
        }
        // const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Include the user ID in the payload
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        }

        return res.status(200).cookie("token", token, {maxAge: 1 * 60 * 60 * 24 * 1000, httpsOnly: true, sameSite:'strict'}).json({
            message: `Welcome back ${user.fullName}`,
            user,
            token,
            success: true
        });

    }
    catch (error) {
        console.log(error.message);
    };
}

export const logout = async (req, res, ) => {
    try {
        return res.status(200).cookie("token","",{maxAge: 0}).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const update = async (req, res) => {
    try {
        
        const { fullName, email } = req.body;
        const userid = req.id;
        let user = await User.findById(userid);
    
        if(!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
    
        if(fullName) user.fullName = fullName;
        if(email) user.email = email;
        await user.save();
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        }

        return res.status(200).json({
            message: 'User updated successfully',
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
    
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        // Step 2: Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`; 
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params; 
    const { password } = req.body; 

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }, 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save();
        res.status(200).json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};