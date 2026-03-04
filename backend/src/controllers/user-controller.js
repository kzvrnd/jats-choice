import { signup } from '../services/auth-service.js';


import { User } from '../models/index.js';


export const getUsers = async(req, res) => {
 
  const users = await User.findAll();

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found"});
  }

  return res.send(users);
}

export const createUser = async(req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password ) {
    return res.status(400).json({ message: "Missing required fields"});
  }  
  
  try {
    const user = await signup(username, email, password);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: { userId: user.id, username, email }
      }
    });

  } catch (error) {
    res.status(400).json({ message: "Error creating user", error: error.message});
  }

} 

export const loginUser = (req, res) => {
  res.send(`login endpoint`);
}

export const logoutUser = (req, res) => {
  res.send(`logout endpoint`);
}