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
    const error = new AppError("User not found", 404);
    error.statusCode = 404;
    throw error;
  }

  if (user.username === name) {
    const error = new AppError("Cannot update to the same name", 400);
    error.statusCode = 400;
    throw error;
  }  
  
  await user.update({ username: name });
  
  return { id: user.id, username: user.username, email: user.email };
}

