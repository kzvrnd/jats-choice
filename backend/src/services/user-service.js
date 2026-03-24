import { User } from '../models/index.js';

export const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}