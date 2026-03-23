import express from 'express';

import * as jobService from '../services/job-service.js';
//import { createJob, getJobsByUser } from '../services/job-service.js';

export const addJob = async (req, res) => {  

  try {
    const job = await jobService.createJob(req.user.id, req.body);
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

