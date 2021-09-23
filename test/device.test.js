const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

let auth = {};

// Connects to database power-rangers
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});

// Test : GET /device?parent={parentId}
test("GET /device?parent={parentId}, It sholud return 200 code", async()=>{
    const res = await request(app).get("/device?parent=60b1ffa3ba5ac70e330a4cbd") ;

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res.body.status).toBe("success");
})

// Test : GET /device/:{deviceId}
test("GET /device/:{deviceId}, It sholud return 200 code", async()=>{
    const res = await request(app).get("/device/60b201d3ba5ac70e330a4cbe") ;

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res.body.status).toBe("success");
})

describe("Authorized Route checking", () => {
  beforeEach(async () => {
    const response = await request(app).post("/user/login").send({
      email: "alex@gmail.com",
      password: "mondal_@",
    });

    auth.token = response.body.token;
  });

  // TEST : POST /device
  test("POST /device,It sholud return 201 code ", async()=>{
      const res = await request(app).post("/device")
      .send({
          title : "iPhone 13",
          parent : "60b1ffa3ba5ac70e330a4cbd"
      })
      .set("Authorization", "Bearer " + auth.token);

      expect(res.statusCode).toBe(201);
    expect(res.statusCode).not.toBe(406);
    expect(res.body.status).toBe("success");
  });

  // TEST : PATCH /device/:{deviceId}
  test("PATCH /device/:{deviceId},It sholud return 200 code ", async()=>{
    const res = await request(app).patch("/device/614c2d523f2c466262bc1ece")
    .send({
        title : "iPhone 13 max",
        image: "upload/image.jpeg"
    })
    .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
  expect(res.statusCode).not.toBe(406);
  expect(res.body.status).toBe("success");
});

// TEST : DELETE /device/:{deviceId}
test("DELETE /device/:{deviceId} ,It sholud return 200 code ", async()=>{
    const res = await request(app).delete("/device/614c2d523f2c466262bc1ece")
    .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
  expect(res.statusCode).not.toBe(406);
  expect(res.statusCode).not.toBe(404);
  expect(res.body.status).toBe("success");
});


// TEST : Get /device/:{deviceId}/repairs
test.only("GET /device/:{deviceId}/repairs ,It sholud return 200 code ", async()=>{
    const res = await request(app).get("/device/60b201d3ba5ac70e330a4cbe/repairs")
    .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
  expect(res.statusCode).not.toBe(406);
  expect(res.statusCode).not.toBe(404);
});
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});