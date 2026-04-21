import express from 'express';
import { addJob, getJobs, deleteJob, updateJob } from '../controllers/job-controller.js';
import { createJobValidator, updateJobValidator, jobQueryValidator } from '../validators/job-validator.js';
import { validateError } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth-middleware.js';

//inprogress import
import { getNewJob } from '../controllers/job-controller.js';

// /api/jobs
const router = express.Router();

router.post('/createjob', authenticate, createJobValidator, validateError, addJob); 
router.get('/getjobs', authenticate, getJobs);
router.delete('/:id', authenticate, deleteJob);
router.patch('/:id', authenticate, updateJobValidator, validateError, updateJob);

//New endpoint testing
router.get('/getnewjobs', authenticate, jobQueryValidator, validateError, getNewJob);


export default router