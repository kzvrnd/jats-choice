import { Job } from "../models/index.js";
import { Op } from "sequelize";
import { AppError } from "../utils/app-error.js";

export const createJob = async( userId, jobData ) => {
  const {title, company, location, description, status, employmentType, contact, salaryMin, salaryMax } = jobData;

  if (!title || !company) {
    throw new AppError('Title and company are required.', 400);
  }

  // While below works, not best since two DB calls
  // const user = await User.findByPk(req.user.id);
  // const job = await user.createJob({ title, company });

  // Both of these are valid returns, but just returning the promise seems to be more preferred and no await.
  return await Job.create({ title, company, location, description, status, employmentType, contact, salaryMin, salaryMax, userId });
  //return Jobs.create({ title, company, userId });
  
}

export const getJobsByUser = async (userId) => {
  return await Job.findAll({ where: { userId }});
}


export const deleteJob = async (userId, jobId) => {
  // Important that the userID is included so there is an ownership check and users can only delete their own jobs
  const job = await Job.findOne({ where: { id: jobId, userId } });
  
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  await job.destroy();
}

export const update = async (userId, jobId, jobData) => {
  const job = await Job.findOne({ where: { id: jobId, userId } });
  
  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const allowedFields = [
    "title", "company", "location",
    "description", "status", "employmentType",
    "salaryMin", "salaryMax", "contact"
  ];
  const filteredData = {};

  // Only update the fields that are in the allowedFields array
  for (const key of allowedFields) {
    if (jobData[key] !== undefined) {
      filteredData[key] = jobData[key];
    }
  }

  await job.update(filteredData);
  

  return job;
} 



export const getJobsFiltered = async (userId, filters) => {
  const {
    status,
    search,
    location,
    employmentType,
    salaryMin,
    salaryMax,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "DESC",
  } = filters;
  

  if (page < 1) {
    throw new AppError('Invalid page.', 400);
  }
  
  if (limit > 100 || limit < 1) {
  throw new AppError('Invalid limit.', 400);
  }

  if (order !== "ASC" && order !== "DESC") {
    throw new AppError('Invalid order.', 400);
  }

  const where = {
    userId,
  };

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { company: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (location) {
    where.location = {
      [Op.ilike]: `%${location}%`,
    }
  }

  if ( employmentType ) {
    where.employmentType = employmentType;
  }

  if (salaryMin || salaryMax) {
    const min = salaryMin ? parseInt(salaryMin) : null;
    const max = salaryMax ? parseInt(salaryMax) : null;

    // If no where[Op.and] array exists, create one also prevents overwriting
    if(!where[Op.and]) { 
      where[Op.and] = [];
    }

    if (min) {
      where[Op.and].push({ salaryMin: { [Op.gte]: min } });
    }
    if (max) {
      where[Op.and].push({ salaryMax: { [Op.lte]: max } });
    }
  }


  //pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * pageSize;

  const { rows, count } = await Job.findAndCountAll({
    where,
    limit: pageSize,
    offset,
    order: [[sortBy, order]],
  });

  return { 
    jobs: rows,
    meta: {
      totalJobs: count,
      currentPage: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize)
    }
  }

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