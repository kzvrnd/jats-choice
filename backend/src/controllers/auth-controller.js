import { signup, login, updatedUserInfo, changePassword} from '../services/auth-service.js';
import { matchedData } from 'express-validator';


export const createUser = async(req, res, next) => {
  const { username, email, password } = matchedData(req);

  if (!username || !email || !password ) {
    return res.status(400).json({ message: "Missing required fields"});
  }  
  
  try {
    const user = await signup({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: { userId: user.id, username: user.username, email: user.email }
      }
    });

  } catch (error) {
    //console.log(error);

    // pre error handler middleware
    //res.status(400).json({ message: "Error creating user", error: error.message});

    // post error handler middleware
    next(error);
  }

} 

export const loginUser = async(req, res) => {
  const { email, password } = matchedData(req);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required"});
  }

  try {
    const { token, user }  = await login({email, password});

    // option for secure cookie set to false for development only
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', Path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });
    // console.log("Token from cookie:", req.cookies.token);
    // console.log("Setting cookie with token:", token);
    console.log('Set-Cookie header:', res.getHeader('Set-Cookie')); // <-- log the raw cookie header
    res.status(200).json({ message: `${user.username} Logged in successfully` });
    
    
  } catch (error) {
    //console.log(error);

    return res.status(401).json({ message: "Invalid credentials"});
  }  
}

export const logoutUser = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'lax' });
  return res.status(200).json({ message: `User Logged out successfully`});
}
 

export const updateUserInfo = async (req, res) => {
  const userId = req.user.id;
  const info = matchedData(req); 

  try {
    const updatedUser = await updatedUserInfo(userId, info);
    return res.status(200).json({ message: "User updated successfully", user: updatedUser });

  } catch (error) {    
    return res.status(400).json({ message: "Error updating user"});
  }
}

export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { password, newPassword } = matchedData(req);

  try {
    const updatedUser = await changePassword(userId, password, newPassword);
    return res.status(200).json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {    
    return res.status(401).json({ message: "Error updating password"});
  }

  // saftey check in case of unknown error
  return res.status(500).json({ message: "Internal server error"});
}



//test or private routes

export const privateRoute = (req, res) => {
  const user = req.user;
  
  if (user) {
    return res.status(200).json({ message: "Private route accessed successfully", user: user });
  } else {
    return res.status(401).json({ message: "Unauthorized" }); 
  }
}






