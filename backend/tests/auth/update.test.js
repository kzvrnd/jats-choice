import  request from "supertest";
import app from "../../src/app.js";
import { User }from "../../src/models/user.js";

describe ("PATCH /api/auth/update", () => {

  let updateTestUser;
  let token;

  updateTestUser = {
    username: "Update Test User",
    email: "updatetest@example.com",
    password: "password123"
  }  

  beforeEach(async () => {

    await request(app)
      .post("/api/auth/signup")
      .send(updateTestUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: updateTestUser.email,
        password: updateTestUser.password
      });

    //console.log(loginResponse.body);
    
    // using jwt http only cookies so we need to get the token from the Set-Cookie
    // header as it is not in the response body
    token = loginResponse.headers["set-cookie"]; // Get the token from the Set-Cookie header in the response
  });

  test("updates a username successfully", async () => {

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        username: "Updated Test User"
      });

    expect(response.statusCode).toBe(200);    

    expect(response.body.message)
      .toBe("User updated successfully");

    expect(response.body.user.username).toBe("Updated Test User");

    

    const updatedUserDb = await User.findOne({where:{
      email: updateTestUser.email  
      } 
    });
    
    expect(updatedUserDb).not.toBeNull();
      
    expect(updatedUserDb.username).toBe("Updated Test User");
  
  });

  test("returns a validation error if username is empty", async () => {

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        username: ""        
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

  test("returns a validation error if username is not a string", async () => {

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        username: 123        
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

  test("returns validation error if email is invalid format", async () => {

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        email: "test@example"        
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
  
  test("returns validation error if email is empty", async () => {

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        email: ""        
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

  test("returns validation error is email is not a string", async () => {

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        email: 123        
      });


    expect(response.statusCode).toBe(400);   

    expect(response.body.message).toBe("Validation failed");    

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
           field: "email", message: "Email must be a string" 
        })
      ])
    );
  });

  test("returns an error if attempted change of email is already in use", async () => {

    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "duplicate UserEmail;",
        email: "duplicateEmail@example.com",
        password: "password123"
      });


    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", token)
      .send({
        email: "duplicateemail@example.com"        
      });

    //console.log(response.body);
    expect(response.statusCode).toBe(409);

    expect(response.body.success).toBe(false);

    // also indirect email normalization test
    expect(response.body.message)
      .toBe("An account with this email already exists.");
  });  
      
});



