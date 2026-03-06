import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET, { expiresIn: '7d' });
};