import express from 'express'
import { getUsers , createUser, loginUser, logoutUser, getMe } from '../controllers/user-controller.js'
import { authenticate } from '../middleware/auth-middleware.js';


const router = express.Router();

router.get ('/', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authenticate, getMe);

export default router






