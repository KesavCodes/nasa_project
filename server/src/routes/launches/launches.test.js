const app = require("../../app.js");
const request = require("supertest");

const connectMongoDb = require("../../services/mongo.js");

describe("Testing Launches API", () => {
  beforeAll(async () => {
    await connectMongoDb();
  });

  describe("Testing GET /launches", () => {
    test("It should respond with 200 success", async () => {
      return await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Testing POST /launches", () => {
    const completeLaunchData = {
      mission: "JS Exo Overlook",
      rocket: "JS IS-07",
      target: "Kepler-442 b",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "JS Exo Overlook",
      rocket: "JS IS-07",
      target: "Kepler-442 b",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect(201)
        .expect("Content-Type", /json/);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect(400)
        .expect("Content-Type", /json/);
      expect(response.body).toStrictEqual({
        ok: false,
        message: "Missing required launch property.",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          ...launchDataWithoutDate,
          launchDate: "Dummy date placeholder",
        })
        .expect(400)
        .expect("Content-Type", /json/);
      expect(response.body).toStrictEqual({
        ok: false,
        message: "Invalid date.",
      });
    });
  });
});
