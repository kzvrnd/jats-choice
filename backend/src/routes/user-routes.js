import express from 'express'
import { getUsers , createUser, loginUser, logoutUser } from '../controllers/user-controller.js'


const router = express.Router();

router.get ('/', getUsers);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router






