import request from "supertest";
import app from "../../src/app.js";

describe("POST /api/auth/signup", () => {

  test("creates a new user successfully", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Test User",
        email: "test@example.com",
        password: "password123"
      });


    //console.log(response.body);
    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message)
      .toBe("User created successfully");

    expect(response.body.data.user)
      .toHaveProperty("userId");

    expect(response.body.data.user.email)
      .toBe("test@example.com");
    
    expect(response.body.data.user)
      .not.toHaveProperty("password");

    expect(response.body.data.user)
      .not.toHaveProperty("passwordHash");


  });

  test("returns an error if email is already in use", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Test User",
        email: "test@example.com",
        password: "password123"
      });
      

    const duplicateResponse = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Test UserTwo",
        email: "test@example.com",
        password: "password123"
      });

    expect(duplicateResponse.statusCode).toBe(409);

    expect(duplicateResponse.body.success).toBe(false);

    expect(duplicateResponse.body.message)
      .toBe("An account with this email already exists.");
  });

  // test for emptpy fields

  test("returns a validation error if username is empty", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "",
        email: "test@example.com",
        password: "password123"
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors[0].message).toBe("Username is required"); 
  });


  test("returns a validation error if email is empty", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Test User",
        email: "",
        password: "password123"
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "email", message: "Email is required" 
        })
      ])
    ); 
  });

  test("returns a validation error if password is empty", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Test User",
        email: "test@example.com",
        password: ""
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "password", message: "Password is required" 
        })
      ])
    );
  }); 

  test("returns a validation error if username is not a string", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: 123,
        email: "test@example.com",
        password: "password123"
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "username", message: "Username must be a string" 
        })
      ])
    );
  });

  test("returns a validation error if email is invalid", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Test User",
        email: "test@example",
        password: "password123"
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "email", message: "Invalid email address" 
        })
      ])
    );
  });

  test("returns a validation error if username is shorter than 3 characters", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Te",
        email: "test@example.com",
        password: "password123"
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "username", message: "Username must be at least 3 characters long" 
        })
      ])
    );
  });

  test("accepts a username with exactly 3 characters", async () => {

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "Tes",
        email: "test@example.com",
        password: "password123"
      });


    expect(response.statusCode).toBe(201);
    
    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe("User created successfully");
  });

  test("returns an error if username contains only whitespace", async () => {  

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "   ",
        email: "test@example.com",
        password: "password123"
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "username", message: "Username is required" 
        })
      ])
    );
  });

  

});