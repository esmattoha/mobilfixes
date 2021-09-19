const request = require("supertest");
const mongoose = require("mongoose");
// const userRoute = require("../routers/userRoute");
const app = require("../app");

let auth = {};

// Connects to database power-rangers
beforeAll(async () => {
   await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});


describe("POST /user/signup", () => {
  test("It should return a status Code", async () => {
    const response = await request(app).post("/user/signup").send({
      name: "Dipu",
      email: "mondal@gmail.com",
      phone: "7718533953",
      password: "dipu_@",
    });

    expect(response.statusCode).toBe(201);
  });
});

describe("POST /user/login", ()=>{
  test("It should return 200 status code", async()=>{
    const response = await request(app).post("/user/login").send({
      email:"alex@gmail.com",
      password: "dipu_@"
    })

    expect(response.statusCode).toBe(200);
  })
})


beforeAll(async()=>{
  const response = await request(app).post("/user/login").send({
    email:"alex@gmail.com",
    password: "dipu_@"
  })

  auth.token = response.body.token;
})

describe("POST /user/me", ()=>{
  test("It should return 200 status code", async()=>{
    const response = await request(app).get("/user/me").set("authorization", auth.token);

    expect(response.statusCode).toBe(200);
  })
})

//
afterAll(async () => {
     await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
    });
  });
  