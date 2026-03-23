import express from 'express'
import { getUsers , createUser, loginUser, logoutUser, getMe } from '../controllers/user-controller.js'
import { authenticate } from '../middleware/auth-middleware.js';
import { privateRoute, allUsers } from '../controllers/user-controller.js';

const router = express.Router();

router.get ('/', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);



//test routes 
router.get('/me', authenticate, getMe); // test auth middleware
router.get('/allusers', allUsers);


//private routes
router.get('/private', authenticate, privateRoute);


export default router






