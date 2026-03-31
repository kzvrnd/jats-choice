import { User } from '../models/index.js';

export const getCurrentUserInfo = async (userId) => {

  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}


export const updatedName = async (userId, name) => {
  //const user = await getCurrentUser(userId);
  const user = await User.findByPk(userId);

    if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  
  await user.update({ username: name });
  
  return { id: user.id, username: user.username, email: user.email };
}