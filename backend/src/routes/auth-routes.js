import express from 'express'
import { createUser, loginUser, logoutUser, updateUserInfo, updatePassword } from '../controllers/auth-controller.js';
import { validateSignup, validateLogin, validateChangePassword, validateUpdate } from '../validators/auth-validator.js';
import { validateError } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth-middleware.js';
import { privateRoute } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', validateSignup, validateError, createUser);
router.post('/login', validateLogin, validateError, loginUser);
router.post('/logout', logoutUser);
router.patch('/update', authenticate, validateUpdate, validateError, updateUserInfo);
router.patch('/change-password', authenticate, validateChangePassword, validateError, updatePassword);


//private routes
router.get('/private', authenticate, privateRoute);


export default router