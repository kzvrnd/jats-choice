import { User } from '../models/index.js';
import { generateAccessToken } from '../utils/token.js';
import bcrypt from 'bcrypt';


export const login = async({ email, password}) => {
  
  const user = await User.findOne({where: { email } });



  if (!user) {
    throw new Error('Invalid credentials.');
  }  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials.');
  }

  const token = generateAccessToken(user);

  //res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  
  return {token, user: {id: user.id, username: user.username, email: user.email, createdAt: user.createdAt }};
};

export const logout = (req, res) => {
  
}

export const signup = async({ username, email, password }) => {
  
  const existingUser = await User.findOne({where: { email } });
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }  

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({username, email, passwordHash });


  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };

}