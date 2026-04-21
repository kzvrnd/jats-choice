import { body, param, query } from "express-validator";

const validStatuses = [
  "saved",
  "applied",
  "interview",
  "rejected",
  "offer",
];

const validEmploymentTypes = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "volunteer",
  "temporary",
];


export const createJobValidator = [
  body("title")
    .exists().withMessage("Title is required")
    .bail()
    .isString().withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty().withMessage("Title cannot be empty"),

  body("company")
    .exists().withMessage("Company is required")
    .bail()
    .isString().withMessage("Company must be a string")
    .bail()
    .trim()
    .notEmpty().withMessage("Company cannot be empty"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .trim(),

  body("location")
    .optional()
    .isString().withMessage("Location must be a string")
    .trim(),

  body("salaryMin")
    .optional()
    .isInt({ min: 0 }).withMessage("salaryMin must be a positive integer")
    .toInt(),

  body("salaryMax")
    .optional()
    .isInt({ min: 0 }).withMessage("salaryMax must be a positive integer")
    .toInt(),

  // Salary range cross-field validation
  body().custom((_, { req }) => {
    const { salaryMin, salaryMax } = req.body;

    if (
      salaryMin !== undefined &&
      salaryMax !== undefined &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      throw new Error("salaryMin must be less than or equal to salaryMax");
    }

    return true;
  }),

  body("contact")
    .optional()
    .isString().withMessage("Contact must be a string")
    .trim(),

  body("status")
    .optional()
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(", ")}`),

  body("employmentType")
    .optional()
    .isIn(validEmploymentTypes)
    .withMessage(
      `Employment type must be one of: ${validEmploymentTypes.join(", ")}`
    )

];


export const updateJobValidator = [

  param("id").exists().withMessage("Job ID is required")
    .isNumeric().withMessage("Job ID must be a number"),

  body("title")
    .optional()
    .isString().withMessage("Title must be a string")
    .trim()
    .notEmpty().withMessage("Title cannot be empty"),

  body("company")
    .optional()
    .isString().withMessage("Company must be a string")
    .trim()
    .notEmpty().withMessage("Company cannot be empty"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .trim(),

  body("location")
    .optional()
    .isString().withMessage("Location must be a string")
    .trim(),

  body("salaryMin")
    .optional()
    .isInt({ min: 0 }).withMessage("salaryMin must be a positive integer")
    .toInt(),

  body("salaryMax")
    .optional()
    .isInt({ min: 0 }).withMessage("salaryMax must be a positive integer")
    .toInt(),

  body().custom((_, { req }) => {
    const { salaryMin, salaryMax } = req.body;

    if (
      salaryMin !== undefined &&
      salaryMax !== undefined &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      throw new Error("salaryMin must be <= salaryMax");
    }

    return true;
  }),

  body("contact")
    .optional()
    .isString().withMessage("Contact must be a string")
    .trim(),

  body("status")
    .optional()
    .isIn(validStatuses)
    .withMessage(`Invalid status`),

  body("employmentType")
    .optional()
    .isIn(validEmploymentTypes)
    .withMessage(`Invalid employment type`),
];



export const jobQueryValidator = [
  query("status")
    .optional()
    .isIn(validStatuses)
    .withMessage("Invalid status"),

  query("employmentType")
    .optional()
    .isIn(validEmploymentTypes)
    .withMessage("Invalid employment type"),

  query("company")
    .optional()
    .isString()
    .trim()
    .notEmpty().withMessage("Company cannot be empty"),

  query("location")
    .optional()
    .isString()
    .trim()
    .notEmpty().withMessage("Location cannot be empty"),

  query("salaryMin")
    .optional()
    .isInt({ min: 0 }).withMessage("salaryMin must be a positive integer")
    .toInt(),

  query("salaryMax")
    .optional()
    .isInt({ min: 0 }).withMessage("salaryMax must be a positive integer")
    .toInt(),

  
  query().custom((_, { req }) => {
    const { salaryMin, salaryMax } = req.query;

    if (
      salaryMin !== undefined &&
      salaryMax !== undefined &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      throw new Error("salaryMin must be <= salaryMax");
    }

    return true;
  }),
  
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page must be >= 1")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
    .toInt(),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "salaryMin", "salaryMax", "title"])
    .withMessage("Invalid sortBy field"),

  query("search")
    .optional()
    .isString().withMessage("Search must be a string")
    .trim()    
    .isLength({ max: 50 }).withMessage("Search cannot be longer than 50 characters"),

  query("order")
    .optional()    
    .trim()    
    .isIn(["ASC", "DESC"]).withMessage("order must be ASC or DESC"),

];