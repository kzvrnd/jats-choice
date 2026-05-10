import { User } from '../models/index.js';
import { AppError } from '../utils/app-error.js';

export const getCurrentUserInfo = async (userId) => {

  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}


export const updatedName = async (userId, name) => {
  
  const user = await User.findByPk(userId);

    if (!user) {
    throw new AppError("User not found", 404);  
  }

  if (user.username === name) {
    throw new AppError("Cannot update to the same name", 400);   
   
  }  
  
  await user.update({ username: name });
  
  return { id: user.id, username: user.username, email: user.email };
}

