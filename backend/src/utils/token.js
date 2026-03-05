import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateAccessToken = (user) => {
  return jwt.sign({ sub: user.id}, process.env.JWT_SECRET, { expiresIn: '7d' });
};