import { matchedData } from 'express-validator';

import * as jobService from '../services/job-service.js';


export const addJob = async (req, res, next) => {
  
  const jobDetails = matchedData(req);

  try {
    const job = await jobService.createJob(req.user.id, jobDetails);
    return res.status(201).json({ message: "Job created successfully", job: job });
  } catch (error) {    
    
    next(error);
  }
}


export const getJobs = async (req, res, next) => {
  
  const query = matchedData(req, { locations: ['query'] });
  const userId = req.user.id;
  
  try {
    const result = await jobService.getJobsFiltered(userId, query);
    res.status(200).json({ message: "Jobs fetched successfully", ...result});
  } catch (error) {    
    next(error);
  }
}

export const deleteJob = async (req, res, next) => {
  
  const userId = req.user.id;
  const { id: jobId } = matchedData(req);

  try {
    await jobService.deleteJob(userId, jobId);    
    return res.status(204).send();

  } catch (error) {  
    
    next(error);
  }
}  

export const updateJob = async (req, res, next) => {
  const data = matchedData(req);
  const { id: jobId, ...updateDetails } = data;
  const userId = req.user.id;

  try {
    const job = await jobService.update(userId, jobId, updateDetails);
    return res.status(200).json({ message: "Job updated successfully", job: job });
  } catch (error) {
    next(error);
  }
}



//development controller to test new segment

export const getNewJob = async (req, res, next) => {

  try {
    const jobs = await jobService.getJobsByUser(req.user.id);
    return res.status(200).json({ jobs: jobs });
  } catch (error) {
    //console.log(error);
    //return res.status(400).json({ message: error.message});
    next(error);
  }
}