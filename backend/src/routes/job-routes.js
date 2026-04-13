import express from 'express';
import { addJob, getJobs, deleteJob, updateJob } from '../controllers/job-controller.js';
import { authenticate } from '../middleware/auth-middleware.js';

//inprogress import
import { getNewJob } from '../controllers/job-controller.js';

const router = express.Router();

router.post('/createjob', authenticate, addJob); 
router.get('/getjobs', authenticate, getJobs);
router.delete('/:id', authenticate, deleteJob);
router.patch('/:id', authenticate, updateJob);

//New endpoint testing
router.get('/getnewjobs', authenticate, getNewJob);


export default router