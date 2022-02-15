const request = require("supertest");
const app = require("../app.js");
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const db = require('../db/connection.js')

beforeEach(() => seed(data))

afterAll(() => db.end());

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
            response.body.forEach((cell) => {
                expect(cell).toEqual(
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
        .get("/api/articles/2")
        .expect(200)
    });
    test("returns a specified object from the database", () => {
        return request(app)
            .get("/api/articles/2")
            .expect(200)
        .then((response) => {
            expect(Object.keys(response.body)).toHaveLength(7);
            expect(response.body).toEqual({
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
});