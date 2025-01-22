import express from 'express';
import { forgotPassword, login, logout, register, resetPassword, update } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout); 
router.route('/forgot-password').post(forgotPassword); 
router.post('/reset-password/:token', resetPassword);
router.route('/update').post(update);

export default router; 

