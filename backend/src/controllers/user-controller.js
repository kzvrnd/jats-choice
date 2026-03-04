import { signup, login } from '../services/auth-service.js';

import { User } from '../models/index.js';


export const getUsers = async(req, res) => {
 
  const users = await User.findAll();

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found"});
  }

  const temp = [];

  users.forEach((user) => {
    temp.push(`${user.id} ${user.username} ${user.email}`);
  })
  return res.send(temp);
}

export const createUser = async(req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password ) {
    return res.status(400).json({ message: "Missing required fields"});
  }  
  
  try {
    const user = await signup({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: { userId: user.id, username: user.username, email: user.email }
      }
    });

  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Error creating user", error: error.message});
  }

} 

export const loginUser = async(req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields"});
  }

  try {
    const user = await login({email, password});

    res.send(`${user.username} Logged in successfully`);

  } catch (error) {
    console.log(error);

    return res.status(401).json({ message: "Invalid credentials"});
  }  
}

export const logoutUser = (req, res) => {
  res.send(`logout endpoint`);
}