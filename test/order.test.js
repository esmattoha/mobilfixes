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

describe("Authorized Route checking", () => {
  beforeEach(async () => {
    const response = await request(app).post("/user/login").send({
      email: "alex@gmail.com",
      password: "mondal_@",
    });

    auth.token = response.body.token;
  });

  // TEST : POST /order
  // test("POST /order , It should return a 201 status code", async () => {
  //   const res = await request(app)
  //     .post("/order")
  //     .send({
  //       type: "appointment",
  //       items: ["60c02bb500c3478174c8e1ca", "60c02c2b00c3478174c8e1cc"],
  //       customerInfo: {
  //         name: "Dipu",
  //         email: "dipu@gmail.com",
  //         phone: "7718533953",
  //       },
  //       shippingAddress: {
  //         addressLine1: "hariharpara",
  //         addressLine2: "berhampore",
  //         city: "murshidabad",
  //         state: "west Bengal",
  //         zipcode: 742166,
  //       },
  //       service: "we-come-to-you",
  //       appointmentTime: "2021-09-24T09:30:00.000+00:00",
  //     })
  //     .set("Authorization", "Bearer" + auth.token);

  //   expect(res.statusCode).toBe(201);
  //   expect(res.statusCode).not.toBe(406);
  // });

  // TEST : GET /order/customer-bookings?limit={limit}
  test("GET /order/customer-bookings?limit={limit} , It should return a status code", async () => {
    const res = await request(app)
      .get("/order/customer-bookings?limit=5")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(403);
    expect(res.body.status).toBe("success");
  });

  // TEST : GET /order
  test("GET /order , It should return a status code", async () => {
    const res = await request(app)
      .get("/order")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res.body.status).toBe("success");
  });

  // TEST : GET /order/:id
  test("GET /order/:id , It should return a status code", async () => {
    const res = await request(app)
      .get("/order/611bf07ca27f68604f42f70a")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res.body.status).toBe("success");
  });

  // TEST : PATCH /order/:id
  test("PATCH /order/:id , It should return a status code", async () => {
    const res = await request(app)
      .patch("/order/614a9afa77f29dc9d7a8953c")
      .send({ status: "cancelled" })
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res.body.message).toBe("Successfull");
  });

  // TEST : DELETE /order/:id
  test("DELETE /order/:id , It should return a status code", async () => {
    const res = await request(app)
      .delete("/order/611bdd51a27f68604f42f6e6")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
    expect(res.body.message).toBe("Deleted");
  });

  // TEST : GET /booked-dates
  test("GET /booked-dates, It should return a 200 code", async () => {
    const res = await request(app)
      .get("/booked-dates")
      .set("Authorization", "Bearer " + auth.token);

    expect(res.statusCode).toBe(200);
  });

});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
});
