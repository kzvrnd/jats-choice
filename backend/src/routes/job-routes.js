import express from 'express';
import { addJob, getJobs, deleteJob, updateJob } from '../controllers/job-controller.js';
import { createJobValidator, updateJobValidator, jobQueryValidator } from '../validators/job-validator.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth-middleware.js';

//inprogress import
import { getNewJob } from '../controllers/job-controller.js';

// /api/jobs
const router = express.Router();

router.post('/createjob', authenticate, createJobValidator, validateRequest, addJob); 
router.get('/getjobs', authenticate, getJobs);
router.delete('/:id', authenticate, deleteJob);
router.patch('/:id', authenticate, updateJobValidator, validateRequest, updateJob);

//New endpoint testing
router.get('/getnewjobs', authenticate, jobQueryValidator, validateRequest, getNewJob);


export default router