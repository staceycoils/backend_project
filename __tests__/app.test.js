const request = require("supertest");
const app = require("../app.js");
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection.js')

beforeEach(() => seed(data))

afterAll(() => db.end());

describe("GET /not-a-path", () => {
  test("Status 404 when given invalid path", () => {
      return request(app)
        .get("/not-a-path")
        .expect(404)
        .then((response) => {
          expect(response.error.text).toBe("Path not found!")
        })
  })
})

describe("GET /api/topics", () => {
    test("Status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
    });
    test("returns an array of objects with properties 'slug', 'description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
        .then((response) => {
            expect(response.body).toHaveLength(3);
            response.body.forEach((topic) => {
                expect(topic).toEqual(
                  {
                    description: expect.any(String),
                    slug: expect.any(String)
                  })
              });
        })
    })
});

describe("GET /api/articles/:article_id", () => {
    test("Status 200", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
    });
    test("returns a specified object from the database", () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
        .then(() => {
            expect.objectContaining({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
              },
            );
        })
    })
    test("Status 404 when valid but non-existant :article_id", () => {
      return request(app)
        .get("/api/articles/4321567")
        .expect(404)
        .then((response) => {
          expect(response.error.text).toBe("Non-valid id")
        })
    });
});