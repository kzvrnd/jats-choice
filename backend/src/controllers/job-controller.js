import express from 'express';
import { matchedData, param } from 'express-validator';

import * as jobService from '../services/job-service.js';


export const addJob = async (req, res) => {
  
  const jobDetails = matchedData(req);

  try {
    const job = await jobService.createJob(req.user.id, jobDetails);
    return res.status(201).json({ message: "Job created successfully", job: job });
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error.message});
  }
}


export const getJobs = async (req, res) => {
  try {
    const jobs = await jobService.getJobsByUser(req.user.id);
    return res.status(200).json({ jobs: jobs });
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error.message});
  }
}

export const deleteJob = async (req, res) => { 

  try {
    await jobService.deleteJob(req.user.id, req.params.id);
    //return res.status(200).json({ message: "Job deleted successfully"});
    return res.status(204).send();

  } catch (error) {
    //console.log(error);
    return res.status(error.statusCode || 500).json({ message: error.message || "Sever error deleting job"});
  }
}  

export const updateJob = async (req, res) => {
  //const jobId = matchedData(req).id;
  const { id: jobId } = matchedData(req);
  const userId = req.user.id;

  try {
    const job = await jobService.update(userId, jobId, req.body);
    return res.status(200).json({ message: "Job updated successfully", job: job });
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error.message});
  }
}



// new segment

export const getNewJob = async (req, res) => {
  
  const query = matchedData(req, { location: ['query'] });
  const userID = req.user.id;
  
  try {
    const result = await jobService.getJobsFiltered(userID, query);
    res.status(200).json(result);
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error: "Failed to fetch jobs"}); 
  }
}