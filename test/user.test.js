const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const crypto = require("crypto");

let auth = {};

// Connects to database power-rangers
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});

// describe("POST /user/signup", () => {
//   test("It should return a status Code", async () => {
//     const response = await request(app).post("/user/signup").send({
//       name: "Dipu",
//       email: "mondal@gmail.com",
//       phone: "7718533953",
//       password: "dipu_@",
//     });

//     expect(response.statusCode).toBe(201);
//   });
// });

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

describe("POST /user/me", () => {
  test("It should return 401 status code", async () => {
    const response = await request(app).get("/user/me");

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({ message: "Unauthorized Request" });
  });
});



//
afterAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});
