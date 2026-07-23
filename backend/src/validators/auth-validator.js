import { body } from "express-validator";

export const validateLogin = [
  
  body("email")
  .trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email address")
  .normalizeEmail(),

  body("password")
  .notEmpty().withMessage("Password is required"),    
]


export const validateChangePassword =  [
    
  body("password")
  .notEmpty().withMessage("Password is required"),

  body("newPassword")
  .notEmpty().withMessage("New password is required"),    
]

export const validateSignup = [

  body("username")
  .isString().withMessage("Username must be a string")
  .trim()
  .notEmpty().withMessage("Username is required")
  .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

  body("email")
  .trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email address")
  .normalizeEmail(),

  body("password")
  .notEmpty().withMessage("Password is required"),    
]

export const validateUpdate =  [

  body("username")
  .optional()
  .isString().withMessage("Username must be a string")
  .trim()
  .notEmpty().withMessage("Username is required"),

  body("email")
  .optional()
  .isString().withMessage("Email must be a string")
  .trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email address")
  .normalizeEmail(),
  

  //here we use a custom validator to check if at least one field (username or email) is provided
  // value is the value of the field in this case represents the entire body
  //!value.username && !value.email could be used in place of !req.body.username && !req.body.email
  body().custom((value, { req }) => {
    if (!req.body.username && !req.body.email) {
      throw new Error('At least one field (username or email) is required');
    }
    return true;
  }),
]