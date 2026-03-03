import fs from 'fs';
import { login, logout } from '../services/auth-service.js';



export const getUsers = (req, res) => {
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
  return res.status(200).json(users);
}

export const createUser = (req, res) => {
    const { username, password } = req.body;
    
    
    const data =  fs.readFileSync('users.json', 'utf-8');
    const userArray = JSON.parse(data);
  
    userArray.push({
      username,
      password
    });   
    
    fs.writeFileSync('users.json', JSON.stringify(userArray, null, 2));
    
    res.send(`Endpoint post working!, ${username}, ${password}`); 
} 

export const loginUser = (req, res) => {
  login(req, res);
}

export const logoutUser = (req, res) => {
  logout(req, res);
}