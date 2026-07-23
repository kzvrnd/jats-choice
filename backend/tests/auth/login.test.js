import request from "supertest";
import app from "../../src/app.js";

describe("POST /api/auth/login", () => {

  const testUser = {
    username: "Login Test User",
    email: "logintest@example.com",
    password: "password123"
  };

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send(testUser);

    //console.log("SIGNUP REPONSE:", response.body);
    expect(response.statusCode).toBe(201);
  });

  test("logs in a user successfully and sets an authentication cookie", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });


    console.log(response.body);
    expect(response.statusCode).toBe(200);    

    expect(response.body.message)
      .toBe("Login Test User Logged in successfully");

    expect(response.headers["set-cookie"]).toBeDefined(); // test if login token is set
  });

  test("returns a validation error if email is empty", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "",
        password: testUser.password
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

  test("returns an 401 error if email does not exist on record", async () => {  

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "emailNotOnRecord@example.com",
        password: testUser.password
      });


    expect(response.statusCode).toBe(401);   

    expect(response.body.message).toBe("Invalid credentials.");

  });

  test("returns a validation error if password is empty", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
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


  test("returns an 401 error if password is incorrect", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "incorrectPassword"
      });


    expect(response.statusCode).toBe(401);   

    expect(response.body.message).toBe("Invalid credentials.");

  });

  test("returns a 401 error if email and password are incorrect", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "emailNotOnRecord@example.com",
        password: "incorrectPassword"
      });


    expect(response.statusCode).toBe(401);   

    expect(response.body.message).toBe("Invalid credentials.");

  });
       
 
});