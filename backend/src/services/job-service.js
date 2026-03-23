import { Job } from "../models/index.js";


export const createJob = async( userId, jobData ) => {
  const {title, company } = jobData;

  if (!title || !company) {
    const error = new Error ('Title and company are required.');
    error.statusCode = 400;
    throw error;
  } 
  // While below works, not best since two DB calls
  // const user = await User.findByPk(req.user.id);
  // const job = await user.createJob({ title, company });

  // Both of these are valid returns, but just returning the promise seems to be more preferred and no await.
  return await Job.create({ title, company, userId });
  //return Jobs.create({ title, company, userId });
  
}

export const getJobsByUser = async (userId) => {
  return await Job.findAll({ where: { userId }});
}


export const deleteJob = async (userId, jobId) => {
  // Important that the userID is included so there is an owenership check and users can only delete their own jobs
  const job = await Job.findOne({ where: { id: jobId, userId } });
  
  if (!job) {
    const error = new Error ('Job not found.');
    error.statusCode = 404;
    throw error;
  }

  await job.destroy();
}


/*

export const addJob = async (req, res) => {
  const { title, company } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    const job = await user.createJob({ title, company });
    //const job = await Job.create({ title, company, userId: req.user.id });
    return res.status(201).json({ message: "Job created successfully", job: job });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error creating job"});
  }
}


export const getJobs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const jobs = await user.getJobs();
    return res.status(200).json({ jobs: jobs });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message});
  }
}

*/