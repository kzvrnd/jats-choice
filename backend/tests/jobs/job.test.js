import request from "supertest";
import app from "../../src/app.js";
import { Job } from "../../src/models/job.js";
import { User } from "../../src/models/user.js";

describe("POST /api/jobs/createjob", () => {
  let jobTestUser;
  let token;

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
      .post("/api/jobs/createjob")
      .set("Cookie", token)
      .send(validJobData);        


    expect(response.statusCode).toBe(201);   

    expect(response.body.message).toBe("Job created successfully");
    //console.log(response.body.job);

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
    expect(response.body.job.id).toBe(jobTestUserId);
    
  });

  test("returns an error if the user is not authenticated", async () => {

    const response = await request(app)
      .post("/api/jobs/createjob")
      .send(validJobData);        


    expect(response.statusCode).toBe(401);   

    expect(response.body.message).toBe("Unauthorized: No token detected");
  });

  test("returns a validation error if title is empty", async () => {  

    const response = await request(app)
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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



  test("a succesful job creation with status omitted", async () => {

    
     const { status, ...jobWithoutStatus } = validJobData;

    const response = await request(app)
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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

  test("returns a validation error is minimum salary is not a number", async () => {

    const response = await request(app)
      .post("/api/jobs/createjob")
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

  test("returns a validation error is minimum salary is not a postive integer", async () => {

    const response = await request(app)
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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
      .post("/api/jobs/createjob")
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