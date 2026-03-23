import express from 'express';
import { addJob, getJobs, deleteJob } from '../controllers/job-controller.js';
import { authenticate } from '../middleware/auth-middleware.js';

const router = express.Router();

router.post('/createjob', authenticate, addJob); // user adds a job
router.get('/getjobs', authenticate, getJobs);
router.delete('/:id', authenticate, deleteJob);


export default router