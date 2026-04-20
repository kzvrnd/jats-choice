import express from 'express'
import { getUsers , getMe, updateUsername } from '../controllers/user-controller.js'
import { validateUpdateUsername } from '../validators/user-validator.js';
import { validateError } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth-middleware.js';
import { allUsers } from '../controllers/user-controller.js';

const router = express.Router();

//routes



//test routes functionaity 
router.get('/me', authenticate, getMe); 
router.patch('/me', authenticate, validateUpdateUsername, validateError, updateUsername);
router.get('/allusers', allUsers);
router.get ('/', getUsers);

//private routes



export default router






