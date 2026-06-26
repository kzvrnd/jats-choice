import express from 'express'
import { getUsers , getMe, updateUsername } from '../controllers/user-controller.js'
import { validateUpdateUsername } from '../validators/user-validator.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth-middleware.js';
import { allUsers } from '../controllers/user-controller.js';

const router = express.Router();

//routes
router.get('/me', authenticate, getMe); 
router.patch('/me', authenticate, validateUpdateUsername, validateRequest, updateUsername);


//test routes functionaity 
router.get('/allusers', allUsers);
router.get ('/', getUsers);

//private routes



export default router






