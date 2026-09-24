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
           field: "salaryMin", message: "Minimum salary must be a positive integer" 
        })
      ])
    );
  });

  test("returns a validation error is minimum salary is not a positive integer", async () => {

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
           field: "salaryMin", message: "Minimum salary must be a positive integer" 
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
           field: "salaryMax", message: "Maximum salary must be a positive integer" 
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
          company: "User 2 Job Company",
          userId: jobTestUserId   
        })
      ])  
    );
      
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

    token = loginResponse.headers["set-cookie"]; 

    const response = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .set("Cookie", token)
      .send({ status: "interview" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Job not found.");
  });
});