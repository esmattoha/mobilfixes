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

// describe("POST /user/signup", () => {
//   test("it should return a status code & Object", async()=>{
//     const data = {
//       name : "Dipu",
//       email : "mondal@gmail.com",
//       phone : "7718533953",
//       password : "dipu_@"
//     }

//     const response = await request(app).post("/user/signup").send(data);

//     expect(response.statusCode).toBe(201);
//     expect(response.statusCode).not.toBe(406);
//     expect(response.body).toMatchObject({
//       status: "success",
//       message: "we have send a link on your email for verification.",
//     })
//   })
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

describe("POST /user/reset", () => {
  test("It should return status code & Object ", async () => {
    const res = await request(app)
      .post("/user/reset")
      .send({ email: "alex@gmail.com" });

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(406);
    expect(res.body).toMatchObject({
      status: "success",
      message: "Please enter the verification code been sent to your email",
    });
  });
});

// describe("POST /user/reset/:buffer", () => {
//   test("It should return status code & Object", async () => {
//     const res = await request(app)
//       .post("/user/reset/:buffer")
//       .send({ password: "dipu_@" });

//     console.log(res.body);
//   });
// });

//
afterAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});
