import express from 'express';
import { addJob, getJobs, deleteJob, updateJob } from '../controllers/job-controller.js';
import { createJobValidator, updateJobValidator, jobQueryValidator, jobIdValidator } from '../validators/job-validator.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth-middleware.js';

//development import only for testing
import { getNewJob } from '../controllers/job-controller.js';

// /api/jobs
const router = express.Router();

router.post('/', authenticate, createJobValidator, validateRequest, addJob);
router.get('/', authenticate, jobQueryValidator, validateRequest, getJobs);
router.delete('/:id', authenticate,jobIdValidator, validateRequest, deleteJob);
router.patch('/:id', authenticate, updateJobValidator, validateRequest, updateJob);


// development routes testing only
router.get('/getjobs', authenticate, getNewJob);

export default router