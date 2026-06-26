import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //valid but not easily readable
    //return res.status(400).json({ errors: errors.array() });

    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg 
      })) 
    });    
  
  }
  next();
};


