import { body } from "express-validator";

export const validateUpdateUsername =  [
  
  body("name")
  .trim()
  .notEmpty().withMessage("Name is required")
  .isString().withMessage("Name must be a string")
  .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
] 