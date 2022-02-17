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

describe.only("GET /api/articles/:article_id", () => {
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
          expect(response.body.msg).toBe("Invalid ID, no data found")
        })
    });
    test("Status 400 when invalid :article_id", () => {
      return request(app)
        .get("/api/articles/notanID")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request")
        })
    });
    //following test cannot be tested until a delete function is added due to no test data being empty
    xtest("Status 204 when valid but empty :article_id", () => {
      return request(app)
        .get("/api/articles/727272")
        .expect(204)
        .then((response) => {
          console.log(response.body.msg, "No data for ID")
        })
    });
});

let newVotes = { incVotes: 1 };

describe("PATCH /api/articles/:article_id", () => {
  test("Status 200", () => {
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200)
    })
  test("Returns the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
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
            votes: 1,
          },
        );
      });
  })
  test("Runs multiple times", () => {
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200)
      .then(() => {
        newVotes.incVotes = -100;
        return request(app)
          .patch("/api/articles/3")
          .send(newVotes)
          .expect(200)
          .then((response) => {
            expect(response.body.votes).toBe(-99)
          })
      })
  })
})
