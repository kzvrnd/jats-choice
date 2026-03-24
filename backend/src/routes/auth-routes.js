import express from 'express'
import { createUser, loginUser, logoutUser } from '../controllers/auth-controller.js'
import { authenticate } from '../middleware/auth-middleware.js';
import { privateRoute } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);



//private routes
router.get('/private', authenticate, privateRoute);


export default router