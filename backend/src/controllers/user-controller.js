
import { login, logout } from '../services/auth-service.js';



export const getUsers = (req, res) => {
 
  return res.status(200).json(users);
}

export const createUser = (req, res) => {
  const { email, password } = req.body;  
    
  res.send(`Endpoint post working!, ${username}, ${password}`); 
} 

export const loginUser = (req, res) => {
  res.send(`login endpoint`);
}

export const logoutUser = (req, res) => {
  res.send(`logout endpoint`);
}