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

  test("logs in a user successfully", async () => {

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
  });

});