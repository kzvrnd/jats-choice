import express from 'express'
import { getUsers , getMe } from '../controllers/user-controller.js'
import { authenticate } from '../middleware/auth-middleware.js';
import { allUsers } from '../controllers/user-controller.js';

const router = express.Router();

//routes



//test routes functionaity 
router.get('/me', authenticate, getMe); 
router.get('/allusers', allUsers);
router.get ('/', getUsers);

//private routes



export default router






