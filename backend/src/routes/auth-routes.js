import express from 'express'
import { createUser, loginUser, logoutUser, updateUserInfo, updatePassword } from '../controllers/auth-controller.js'
import { authenticate } from '../middleware/auth-middleware.js';
import { privateRoute } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.patch('/update', authenticate, updateUserInfo);
router.patch('/change-password', authenticate, updatePassword);


//private routes
router.get('/private', authenticate, privateRoute);


export default router