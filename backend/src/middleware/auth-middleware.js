import jwt from 'jsonwebtoken';


export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("Token from cookie in middleware:", token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token detected' }); 
  }
  // console.log("Cookies:", req.cookies);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log('Decoded token:', decoded);
    req.user = decoded;    
    next();
  } catch (error) {
    console.log('JWT error:', err);
    return res.status(403).json({ message: 'Unauthorized' }); 
  }
};