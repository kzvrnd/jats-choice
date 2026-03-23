import express from 'express';

import { createJob, getJobsByUser } from '../services/job-service.js';

export const addJob = async (req, res) => {  

  try {
    const job = await createJob(req.user.id, req.body);
    return res.status(201).json({ message: "Job created successfully", job: job });
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error.message});
  }
}


export const getJobs = async (req, res) => {
  try {
    const jobs = await getJobsByUser(req.user.id);
    return res.status(200).json({ jobs: jobs });
  } catch (error) {
    //console.log(error);
    return res.status(400).json({ message: error.message});
  }
}