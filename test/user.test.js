const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

let auth = {};

// Connects to database power-rangers
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});

// Test : POST /user/signup
describe("POST /user/signup", () => {
  test("it should return a status code & Object", async()=>{
    const data = {
      name : "Dipu",
      email : "alex@gmail.com",
      phone : "7718533953",
      password : "dipu_@"
    }

    const response = await request(app).post("/user/signup").send(data);

    expect(response.statusCode).toBe(201);
    expect(response.statusCode).not.toBe(406);
    expect(response.body).toMatchObject({
      status: "success",
      message: "we have send a link on your email for verification.",
    })
  })
});

// Test : POST /user/email-verification/:token
describe("POST /user/email-verification/:token", () => {
  test("It should return 200 status code", async () => {
    const res = await request(app).post("/user/email-verification/c8960581aa4c7d92c85530beb430f112cbe639bc4c30f5a8026714e186764e6c")

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
  });
});


// Test : POST /user/login
describe("POST /user/login", () => {
  test("It should return 200 status code", async () => {
    const response = await request(app).post("/user/login").send({
      email: "alex@gmail.com",
      password: "dipu_@",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe("alex@gmail.com");
  });
});

/**
 * 
 */
describe("Admin Authorization Route checking", () => {
  beforeEach(async () => {
    const response = await request(app).post("/user/login").send({
      email: "alex@gmail.com",
      password: "dipu_@",
    });

    auth.token = response.body.token;
  });

  // Test : DELETE /user/delete/:id
  test("DELETE /user/delete/:id , It Should return status code", async () => {
    const res = await request(app)
      .delete("/user/delete/6144bb9bdfef8c29c1ff694a")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(401);
    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
    expect(res.body).not.toMatchObject({ message: "Unauthenticated!" });
  });
});

/**
 * 
 */
describe("Authorization Route checking", () => {
  beforeEach(async () => {
    const response = await request(app).post("/user/login").send({
      email: "alex@gmail.com",
      password: "dipu_@",
    });

    auth.token = response.body.token;
  });

  // Test : GET /user/me
  test("GET /user/me , It Should return status code", async () => {
    const res = await request(app)
      .get("/user/me")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(401);
    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
  });

  // Test : PATCH /user/me
  test("PATCH /user/me , It should return status code & message", async () => {
    const res = await request(app)
      .patch("/user/me")
      .send({
        name: "Dipu",
        email: "alex@gmail.com",
        phone: "7718533953",
      })
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(406);
    expect(res.statusCode).not.toBe(404);
    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
    expect(res.body).toMatchObject({
      status: "Success",
      message: "Your request has complete successfully.",
    });
  });

  // Test : POST /user/address
  test("POST /user/address , It should return status code & message", async () => {
    const address = {
      addressLine1: "Vadiriyapara",
      addressLine2: "Domkal",
      city: "Murshidabad",
      state: "West Bengal",
      zipcode: 742133,
    };

    const res = await request(app)
      .post("/user/address")
      .send(address)
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(201);
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(406);

    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
    expect(res.body).toMatchObject({
      status: "success",
      message: "Resource created",
    });
  });

  // Test : GET /user/address
  test("GET /user/address , It should return status code & status", async () => {
    const res = await request(app)
      .get("/user/address")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(401);
    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
    expect(res.body.status).toBe("success");
  });

  // Test : PATCH /user/address
  test("PATCH /user/address ,  It should return status code & status", async () => {
    const res = await request(app)
      .patch("/user/address?addressId=61499ec9554066b35fb4e686")
      .send({
        addressLine1: "Vadiriyapara1",
        addressLine2: "Domkal1",
        city: "Murshidabad1",
        state: "West Bengal1",
        zipcode: 742133,
      })
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(406);
    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
    expect(res.body.status).toBe("success");
  });

  // Test : DELETE /user/address
  test("DELETE /user/address ,  It should return status code & status", async () => {
    const res = await request(app)
      .delete("/user/address?addressId=61499ec9554066b35fb4e686")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(406);
    expect(res.body).not.toMatchObject({ message: "Unauthorized Request" });
    expect(res.body.status).toBe("success");
  });
});


describe("POST /user/reset, " , ()=>{
  test("It should return a status code", async()=>{
    const response = await request(app).post("/user/reset").send({ email : "alex@gmail.com"});

    expect(response.statusCode).toBe(200);

  }, 30000)
})

describe("POST /user/reset/:buffer, " , ()=>{
  test("It should return a status code", async()=>{
    const res = await request(app).post("/user/reset/899e5686c3ddd47ddb799abdab13c4460603c350fe3f46a60441cb8ea72f84a7").send({
      password: "mondal_@",
      confirmPassword: "mondal_@"
    });

    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(406);
  }, 30000)
})

//
afterAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});
