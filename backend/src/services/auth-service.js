import { User } from '../models/index.js';
import { generateAccessToken } from '../utils/token.js';
import { AppError } from '../utils/app-error.js';
import bcrypt from 'bcrypt';


export const login = async({ email, password}) => {
  
  const user = await User.findOne({where: { email } });

  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials.', 401);
  }

  const token = generateAccessToken(user);

  //res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  
  return {token, user: {id: user.id, username: user.username, email: user.email, createdAt: user.createdAt }};
};

export const signup = async({ username, email, password }) => {
  
  const existingUser = await User.findOne({where: { email } });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }  

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({username, email, passwordHash });

  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}

export const updatedUserInfo = async (userId, updatedInfo) => { 
  
  const { username, email } = updatedInfo;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (!username && !email) {
    throw new AppError ("No fields to update.", 400);
  }

  const updates = {};

  if (username) updates.username = username;

  if (email) {
    const existingUser = await User.findOne({where: { email } });
    if (existingUser && existingUser.id !== userId) {
      throw new AppError('An account with this email already exists.', 409);
    }

    updates.email = email;
  }
  
  await user.update(updates);

  return { id: user.id, username:user.username, email:user.email };
}

export const changePassword = async(userId, oldPassword, newPassword) => {

  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (!oldPassword || !newPassword) {
    throw new AppError('Missing required fields.', 400);
  }

  if (oldPassword === newPassword) {
    throw new AppError('New password cannot be the same as the old password.', 400);
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials.', 401);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await user.update({ passwordHash });

  return { id: user.id, username:user.username, email:user.email };
}


