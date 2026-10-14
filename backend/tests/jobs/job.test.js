import request from "supertest";
import app from "../../src/app.js";
import { Job } from "../../src/models/job.js";
import { User } from "../../src/models/user.js";

describe("POST /api/jobs/", () => {
  let jobTestUser;
  let token;
  let jobTestUserId; 

  jobTestUser = {
    username: "Job Test User",
    email: "jobtest@example.com",
    password: "password123"
  }
  
  const validJobData = {
    title: "Job Title",
    company: "Job Company",
    description: "Job Description",
    location: "Job Location",
    salaryMin: 1000,
    salaryMax: 10000,
    contact: "Job Contact",
    status: "applied",  
    employmentType: "full-time"

  }

  beforeEach(async () => {

    await request(app)
      .post("/api/auth/signup")
      .send(jobTestUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: jobTestUser.email,
        password: jobTestUser.password
      });

    //console.log(loginResponse.body);
    
    // using jwt http only cookies so we need to get the token from the Set-Cookie
    // header as it is not in the response body
    token = loginResponse.headers["set-cookie"]; // Get the token from the Set-Cookie header in the response

    const user = await User.findOne({ where: { email: jobTestUser.email }});

    jobTestUserId = user.id;
  });

  test("creates a job successfully for an authenticated user", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);
      
    const job = await Job.findOne({ where: { title: validJobData.title,
      company: validJobData.company,
      userId: jobTestUserId
     }
    });


    expect(response.statusCode).toBe(201);   

    expect(response.body.message).toBe("Job created successfully");
    

    expect(response.body.job).toEqual(
      expect.objectContaining({
        title: validJobData.title,
        company: validJobData.company,
        location: validJobData.location,
        description: validJobData.description,
        status: validJobData.status,
        employmentType: validJobData.employmentType,
        contact: validJobData.contact,
        salaryMin: validJobData.salaryMin,
        salaryMax: validJobData.salaryMax,
      })
    );

    // check that the job was created for the correct user
    expect(response.body.job.userId).toBe(jobTestUserId);

    // check that the job was created in the database
    expect(job).not.toBeNull();
    
  });

  test("returns an error if the user is not authenticated", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .send(validJobData);        


    expect(response.statusCode).toBe(401);   

    expect(response.body.message).toBe("Unauthorized: No token detected");
  });

  test("returns a validation error if title is empty", async () => {  

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        title: ""
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "title", message: "Title cannot be empty" 
        })
      ])
    );
  });

  test("returns a validation error if company is empty", async () => {  

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        company: ""
      });       


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "company", message: "Company cannot be empty" 
        })
      ])
    );
  });

  test("returns a validation error if description is not a string", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        description: 123
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "description", message: "Description must be a string" 
        })
      ])
    );
  });

  test("returns a validation error if location is not a string", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        location: 123
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "location", message: "Location must be a string" 
        })
      ])
    );
  });

  test("returns a validation error if contact is not a string", async () => { 

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        contact: 123
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "contact", message: "Contact must be a string" 
        })
      ])
    );
  });



  test("a successful job creation with status omitted", async () => {

    
     const { status, ...jobWithoutStatus } = validJobData;

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...jobWithoutStatus
      });     


    expect(response.statusCode).toBe(201);   

    expect(response.body.message).toBe("Job created successfully");

    expect(response.body.job)
      .toHaveProperty("id");  

  });

  test("returns a validation error if an invalid status is provided", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        status: "invalidStatus"
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "status", message: "Status must be one of: saved, applied, interview, rejected, offer" 
        })
      ])
    );
  });

  test("returns a validation error if an invalid employment type is provided", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        employmentType: "invalidEmploymentType"
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "employmentType", message: "Employment type must be one of: full-time, part-time, contract, internship, volunteer, temporary" 
        })
      ])
    );
  });

  test("returns a validation error if minimum salary is not a number", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        salaryMin: "invalidSalary"
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMin", message: "Minimum salary must be 0 or greater" 
        })
      ])
    );
  });

  test("returns a validation error is minimum salary is less than zero", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        salaryMin: -1
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMin", message: "Minimum salary must be 0 or greater" 
        })
      ])
    );
  }); 

  test("returns a validation error is maximum salary is not a number", async () => {  

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        salaryMax: "invalidSalary"
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMax", message: "Maximum salary must be 0 or greater" 
        })
      ])
    );
  });

  test("returns a validation error is maximum salary is not greater than minimum salary", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        salaryMax: 1000,
        salaryMin: 2000
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMax", message: "Minimum salary must be less than or equal to maximum salary" 
        })
      ])
    );   
  });

  test("returns a validation error is maximum salary is less than zero", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        salaryMax: -1
      });        


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMax", message: "Maximum salary must be 0 or greater" 
        })
      ])
    );
  });

  test("A successful request when salarymin and salarymax are equal", async () => {

    const response = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({
        ...validJobData,
        salaryMax: 1000,
        salaryMin: 1000
      });        


    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Job created successfully");
    expect(response.body.job).toEqual(expect.objectContaining({
        title: validJobData.title,
        company: validJobData.company,
        location: validJobData.location,
        description: validJobData.description,
        status: validJobData.status,
        employmentType: validJobData.employmentType,
        contact: validJobData.contact,
        salaryMin: 1000,
        salaryMax: 1000
    }));
  });

})

describe("GET /api/jobs/", () => {

  let jobTestUser;
  let token;
  let jobTestUserId;

  jobTestUser = {
    username: "Job Test User",
    email: "jobtest@example.com",
    password: "password123"
  }
  
  const validJobData = {
    title: "Job Title",
    company: "Job Company",
    description: "Job Description",
    location: "Job Location",
    salaryMin: 1000,
    salaryMax: 10000,
    contact: "Job Contact",
    status: "applied",  
    employmentType: "full-time"

  }

  beforeEach(async () => {

    await request(app)
      .post("/api/auth/signup")
      .send(jobTestUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: jobTestUser.email,
        password: jobTestUser.password
      });

    token = loginResponse.headers["set-cookie"]; 

    const user = await User.findOne({ where: { email: jobTestUser.email }});

    jobTestUserId = user.id;
  });

  test("returns a list of jobs", async () => {

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({...validJobData,
        title: "Job Title 2",
        company: "Job Company 2",
      });

    const response = await request(app)
      .get("/api/jobs/")
      .set("Cookie", token);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Jobs fetched successfully");
    expect(response.body.jobs).toHaveLength(2);

    expect(response.body.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Job Title",
          company: "Job Company"   
        }),

        expect.objectContaining({
          title: "Job Title 2",
          company: "Job Company 2"   
        })
      ])
    );

  });

  test("returns an error if the user is not authenticated", async () => {

    const response = await request(app)
      .get("/api/jobs/");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized: No token detected");
  });

  test("only returns jobs that belong to the appropriate user", async () => { 

    const userTwo = {
      username: "Job Test User 2",
      email: "jobtest2@example.com",
      password: "password123"
    }
  
    await request(app)
      .post("/api/auth/signup")
      .send(userTwo);
  
    const userTwoLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: userTwo.email,
        password: userTwo.password
      });
  
    const findUserTwo = await User.findOne({ where: { email: userTwo.email }});
    const userTwoId = findUserTwo.id;
    const token2 = userTwoLoginResponse.headers["set-cookie"];

     await request(app)
      .post("/api/jobs/")
      .set("Cookie", token2)
      .send({...validJobData,
        title: "User 2 Job Title",
        company: "User 2 Job Company",
      });
      

    const userTwoJobResponse = await request(app)
      .get("/api/jobs/")
      .set("Cookie", token2);

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);

    const response = await request(app)
      .get("/api/jobs/")
      .set("Cookie", token);

    expect(userTwoJobResponse.statusCode).toBe(200);
    expect(userTwoJobResponse.body.jobs).toHaveLength(1);
    expect(userTwoJobResponse.body.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "User 2 Job Title",
          company: "User 2 Job Company",
          userId: userTwoId   
        })
      ])  
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Jobs fetched successfully");
    expect(response.body.jobs).toHaveLength(1);
    expect(response.body.jobs).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "User 2 Job Title",
          company: "User 2 Job Company"           
        })
      ])  
    );
    
    expect(response.body.jobs).toHaveLength(1);
      
  });

  test("returns an empty array if the user has no jobs", async () => {

    const response = await request(app)
      .get("/api/jobs/")
      .set("Cookie", token);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Jobs fetched successfully");
    expect(response.body.jobs).toHaveLength(0);
    expect(response.body.jobs).toEqual([]);
  });

  test("returns jobs with matching status if provided", async () => {  

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({...validJobData,
        status: "applied"
      });

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({...validJobData,
        status: "rejected"
      });

    const response = await request(app)
      .get("/api/jobs/?status=applied")
      .set("Cookie", token);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Jobs fetched successfully");
    expect(response.body.jobs).toHaveLength(1);
    expect(response.body.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "applied"   
        })
      ])
    );
  });

  test("returns jobs matching the search term in the title", async () => {  

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({...validJobData,
        title: "awkward title"
      });

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);

    const response = await request(app)
      .get("/api/jobs/?search=awkward")
      .set("Cookie", token);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Jobs fetched successfully");
    expect(response.body.jobs).toHaveLength(1);
    expect(response.body.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "awkward title"   
        })
      ])
    );
  });

  test("returns jobs with matching location if provided", async () => {  

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({...validJobData,
        location: "New York"
      });

    await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);

    const response = await request(app)
      .get("/api/jobs/?location=new")
      .set("Cookie", token);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Jobs fetched successfully");
    expect(response.body.jobs).toHaveLength(1);
    expect(response.body.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          location: "New York"   
        })
      ])
    );
  });

  test("returns a validation error if page is less than 1", async () => {    

    const response = await request(app)
      .get("/api/jobs?page=0")
      .set("Cookie", token);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "page", message: "page must be greater than 0" 
        })
      ])
    );
  });

  test("returns a validation error if page is not a number", async () => {    

    const response = await request(app)
      .get("/api/jobs?page=a")
      .set("Cookie", token);    

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "page", message: "page must be greater than 0" 
        })
      ])
    );
  });

  test("returns a validation error if limit is less than 1", async () => {    

    const response = await request(app)
      .get("/api/jobs?limit=0")
      .set("Cookie", token);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "limit", message: "limit must be between 1 and 100" 
        })
      ])
    );
  });

  test("returns a validation error if limit is greater than 100", async () => {    

    const response = await request(app)
      .get("/api/jobs?limit=101")
      .set("Cookie", token);    

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "limit", message: "limit must be between 1 and 100" 
        })
      ])
    );
  });

  test("returns a validation error if limit is not a number", async () => {    

    const response = await request(app)
      .get("/api/jobs?limit=a")
      .set("Cookie", token);    

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "limit", message: "limit must be between 1 and 100" 
        })
      ])
    );
  });

  test("returns a validation error if sortBy is invalid", async () => {    

    const response = await request(app)
      .get("/api/jobs?sortBy=invalid")
      .set("Cookie", token);    

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "sortBy", message: "Invalid sortBy field" 
        })
      ])
    );    
  });


  test("returns a validation error if search is greater than 50 characters", async () => {    

    const repeater = "a".repeat(51);
    const response = await request(app)
      .get(`/api/jobs?search=${repeater}`)
      .set("Cookie", token);    

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "search", message: "Search cannot be longer than 50 characters" 
        })
      ])
    );    
  });

  //console.log(repeater.length);
  //console.log(`/api/jobs?search=${repeater}`);


});

describe("PATCH /api/jobs/:id", () => { 
  let jobTestUser;
  let token;
  let jobTestUserId;
  let jobId;

  jobTestUser = {
    username: "Job Test User",
    email: "jobtest@example.com",
    password: "password123"
  }
  
  const validJobData = {
    title: "Job Title",
    company: "Job Company",
    description: "Job Description",
    location: "Job Location",
    salaryMin: 1000,
    salaryMax: 10000,
    contact: "Job Contact",
    status: "applied",  
    employmentType: "full-time"

  }

  beforeEach(async () => {

    await request(app)
      .post("/api/auth/signup")
      .send(jobTestUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: jobTestUser.email,
        password: jobTestUser.password
      });

    token = loginResponse.headers["set-cookie"]; 

    const user = await User.findOne({ where: { email: jobTestUser.email }});

    jobTestUserId = user.id;

    const jobResponse = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);

    jobId = jobResponse.body.job.id;
  });
  
  test("updates a job successfully", async () => {  

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ status: "interview" });      
      
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Job updated successfully");
    expect(response.body.job.status).toBe("interview");
      
    const updatedJob = await Job.findOne({ where: { id: jobId }});
    expect(updatedJob.status).toBe("interview");
  });

  test("User can only update their own job", async () => { 
    
    const secondUser = {...jobTestUser, email: "jobtest2@example.com"};
    await request(app)
      .post("/api/auth/signup")
      .send(secondUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: secondUser.email,
        password: secondUser.password
      });

    
    const secondUserToken = loginResponse.headers["set-cookie"]; 

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", secondUserToken)
      .send({ status: "interview" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Job not found.");

    // Check that the job was not updated for the first user.
    const firstUserJob = await Job.findOne({ where: { id: jobId }});
    expect(firstUserJob.status).toBe("applied");
    
  });

  test("returns a validation error if an invalid status is provided", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ status: "invalid" });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "status", message: "Invalid status" 
        })
      ])
    );
  });

  test("returns a validation error if an invalid employment type is provided", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ employmentType: "invalid" });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "employmentType", message: "Invalid employment type" 
        })
      ])
    );
  });

  test("returns a validation error if jobId is not a number", async () => {

    const response = await request(app)
      .patch(`/api/jobs/a`)
      .set("Cookie", token)
      .send({ status: "interview" });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "id", message: "Job ID must be a positive number" 
        })
      ])
    );
  });

  test("returns a validation error if jobId is a negative number", async () => {  

    const response = await request(app)
      .patch(`/api/jobs/-1`)
      .set("Cookie", token)
      .send({ status: "interview" });    

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "id", message: "Job ID must be a positive number" 
        })
      ])
    );
  });

  test("returns a validation error if jobId is 0", async () => {

    const response = await request(app)
      .patch(`/api/jobs/0`)
      .set("Cookie", token)
      .send({ status: "interview" });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "id", message: "Job ID must be a positive number" 
        })
      ])
    );
  });

  test("returns an error if the jobId does not exist", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId + 1}`)
      .set("Cookie", token)
      .send({ status: "interview" });

    expect(response.statusCode).toBe(404);   
    expect(response.body.message).toBe("Job not found.");
  });

  test("returns an error if the user is not authenticated", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .send({ status: "interview" });

    expect(response.statusCode).toBe(401);   
    expect(response.body.message).toBe("Unauthorized: No token detected");
  });

  test("returns a validation error if title is not a string", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ title: 123 });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "title", message: "Title must be a string"
        })
      ])
    );
  })

  test("returns a validation error if title is empty whitespace", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ title: "   " });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "title", message: "Title cannot be empty"
        })
      ])
    );
  });

  test("returns a validation error if company is not a string", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ company: 123 });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "company", message: "Company must be a string"
        })
      ])
    );
  })

  test("returns a validation error if company is empty whitespace", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ company: "   " });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "company", message: "Company cannot be empty"
        })
      ])
    );
  });

  test("returns a validation error if description is not a string", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ description: 123 });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "description", message: "Description must be a string"
        })
      ])
    );
  });

  test("returns a validation error if location is not a string", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ location: 123 });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "location", message: "Location must be a string"
        })
      ])
    );
  });

  test("returns a validation error if contact is not a string", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ contact: 123 });

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "contact", message: "Contact must be a string"
        })
      ])
    );
  });

  test("returns an error if minimum salary is attempting to be updated to a value greater than maximum salary", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ salaryMin: 20000}); 

    const job = await Job.findByPk(jobId);    
    
    expect(response.statusCode).toBe(400);       

    expect(response.body.message).toBe("Minimum salary cannot be greater than maximum salary.");

    expect(job.salaryMin).toBe(validJobData.salaryMin);
    expect(job.salaryMax).toBe(validJobData.salaryMax);

  });

  test("returns a validation error if minimum salary is not a number", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ salaryMin: "abc"}); 

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMin", message: "Minimum salary must be 0 or greater"
        })
      ])
    );
  });

  test("returns a validation error if minimum salary less than zero", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ salaryMin: -1}); 

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "salaryMin", message: "Minimum salary must be 0 or greater"
        })
      ])
    );
  });

  test("returns a success and updates the job when sending multiple fields", async () => { 

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({
        title: "Jr. Software Developer",
        company: "Your Fantasic Company",
        description: "Great atmosphere, great professionalism",
        location: "Los Angeles",
        salaryMin: 65000,
        salaryMax: 105000
      }); 

    const job = await Job.findByPk(jobId);

    expect(response.statusCode).toBe(200);

    expect(job.title).toBe("Jr. Software Developer");
    expect(job.company).toBe("Your Fantasic Company");
    expect(job.description).toBe("Great atmosphere, great professionalism");
    expect(job.location).toBe("Los Angeles");
    expect(job.salaryMin).toBe(65000);
    expect(job.salaryMax).toBe(105000);

  });

  test("returns an error if all fields are empty", async () => {

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({}); 

    expect(response.statusCode).toBe(400);   
    expect(response.body.message).toBe("At least one field must be provided to update.");    
  });

});

describe("DELETE /api/jobs/:id", () => {

  let jobTestUser;
  let token;
  let jobTestUserId;
  let jobId;

  jobTestUser = {
    username: "Delete Job Test User",
    email: "jobtest@example.com",
    password: "password123"
  }
  
  const validJobData = {
    title: "Job Title",
    company: "Job Company",
    description: "Job Description",
    location: "Job Location",
    salaryMin: 1000,
    salaryMax: 10000,
    contact: "Job Contact",
    status: "applied",  
    employmentType: "full-time"

  }

  beforeEach(async () => {

    await request(app)
      .post("/api/auth/signup")
      .send(jobTestUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: jobTestUser.email,
        password: jobTestUser.password
      });

    token = loginResponse.headers["set-cookie"]; 

    const user = await User.findOne({ where: { email: jobTestUser.email }});

    jobTestUserId = user.id;

    const jobResponse = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send(validJobData);

    jobId = jobResponse.body.job.id;
  });

  test("deletes a job successfully", async () => {
    const response = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set("Cookie", token);

    expect(response.statusCode).toBe(204);

    const deletedJob = await Job.findByPk(jobId);

    expect(deletedJob).toBeNull();    
  });

  test("User can only delete their own job", async () => { 
    
    const secondUser = {...jobTestUser, email: "jobtest2@example.com"};
    await request(app)
      .post("/api/auth/signup")
      .send(secondUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: secondUser.email,
        password: secondUser.password
      });

    const secondUsertoken = loginResponse.headers["set-cookie"]; 

    const jobResponse = await request(app)
      .post("/api/jobs/")
      .set("Cookie", secondUsertoken)
      .send(validJobData);

    const secondJobId = jobResponse.body.job.id;

    // Test trying to delete the first user's job as the second user.
    const response = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set("Cookie", secondUsertoken);

    expect(response.statusCode).toBe(404);

    const userOneJob = await Job.findByPk(jobId);

    expect(userOneJob).not.toBeNull();

    // Test trying to delete the second user's job as the first user
    const responseTwo = await request(app)
      .delete(`/api/jobs/${secondJobId}`)
      .set("Cookie", token);

    expect(responseTwo.statusCode).toBe(404);

    const userTwoJob = await Job.findByPk(secondJobId);

    expect(userTwoJob).not.toBeNull();
  });

  test("returns an error if the jobId does not exist", async () => {

    const response = await request(app)
      .delete(`/api/jobs/${jobId + 1}`)
      .set("Cookie", token);

    expect(response.statusCode).toBe(404);   
    expect(response.body.message).toBe("Job not found.");    
  });

  test("returns an error if the user is not authenticated", async () => {

    const response = await request(app)
      .delete(`/api/jobs/${jobId}`);

    expect(response.statusCode).toBe(401);   
    expect(response.body.message).toBe("Unauthorized: No token detected");    
  });

  test("deleting the same job twice returns an error", async () => {
    const response = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set("Cookie", token);

    const responseTwo = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set("Cookie", token);

    expect(responseTwo.statusCode).toBe(404);   
    expect(responseTwo.body.message).toBe("Job not found.");    
  });

  test("delete only the specific job when the user has multiple jobs", async () => {

    const jobResponse = await request(app)
      .post("/api/jobs/")
      .set("Cookie", token)
      .send({...validJobData,
        title: " Job 2 Title",
        company: "Job 2 Company",
      });

    const secondJobId = jobResponse.body.job.id;  

    const response = await request(app)
      .delete(`/api/jobs/${secondJobId}`)
      .set("Cookie", token);

    expect(response.statusCode).toBe(204);

    const deletedJob = await Job.findByPk(secondJobId);

    expect(deletedJob).toBeNull();  

    const userJobs = await Job.findAll({ where: { userId: jobTestUserId }});

    expect(userJobs.length).toBe(1);
  });

});