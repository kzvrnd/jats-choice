import { getCurrentUser } from '../services/user-service.js';

import { User } from '../models/index.js';

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const curUser = await getCurrentUser(userId);

    return res.status(200).json({ user: curUser });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Error retrieving user"});
  } 

}  
  

//test or private routes

export const allUsers = async (req, res) => {
  const user_list = await User.findAll();

  return res.status(200).json({ users: user_list });
}

//temporary for testing purposes
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


