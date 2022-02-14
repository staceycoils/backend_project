const { request } = require("supertest");
const app = require("../app.js")
  
  describe("GET /api/topics", () => {
    test("Status 200, returns an array of objects with properties 'slug', 'description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
    })
})