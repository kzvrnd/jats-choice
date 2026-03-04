import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

export const login = async({ email, password}) => {
  
  
};

export const logout = (req, res) => {
  
}

export const signup = async({username, email, password}) => {
  
  const existingUser = await User.findOne({where: { email } });
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }  

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({username, email, passwordHash });


  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };

}