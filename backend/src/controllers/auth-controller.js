import { signup, login} from '../services/auth-service.js';


export const createUser = async(req, res) => {
  const { username, email, password } = req.body;

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
    console.log(error);

    res.status(400).json({ message: "Error creating user", error: error.message});
  }

} 

export const loginUser = async(req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields"});
  }

  try {
    const { token, user }  = await login({email, password});

    // option for secure cookie set to false for development only
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.status(200).json({ message: `${user.username} Logged in successfully` });
    

  } catch (error) {
    console.log(error);

    return res.status(401).json({ message: "Invalid credentials"});
  }  
}

export const logoutUser = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'lax' });
  return res.status(200).json({ message: `User Logged out successfully`});
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






