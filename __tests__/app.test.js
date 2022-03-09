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
        .then(({ error }) => {
          expect(error.text).toBe("Path not found!")
        })
  })
})

describe('GET /api', () => {
  test('Status 200', () => {
    return request(app)
      .get('/api')
      .expect(200)
  });
  test('Returns a JSON', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(JSON.parse(body)).toBeTruthy()
      })
  });
  test('Returns all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        const endpoints = JSON.parse(body)
        expect(Object.keys(endpoints)).toEqual(
          expect.arrayContaining([
          'GET /api' ,
          'GET /api/topics' ,
          'GET /api/articles' ,
          'GET /api/articles/:article_id' ,
          'PATCH /api/articles/:article_id' ,
          'GET /api/articles/:article_id/comments' ,
          'POST /api/articles/:article_id/comments' ,
          'DELETE /api/comments/:comment_id' ,
          'GET /api/users' ,
        ]))
      })
  });
  test('Lists a description and example response for each endpoint ("/api" not included)', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        const endpoints = JSON.parse(body)
        delete endpoints['GET /api']
        for (const endpoint in endpoints) {
          expect(endpoints[endpoint]).toEqual(
            expect.objectContaining({
              "description": expect.any(String),
              "exampleResponse": expect.any(Object),
            })
          )
        }
      })
  })
});

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
        .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
                expect(topic).toEqual(
                  {
                    description: expect.any(String),
                    slug: expect.any(String)
                  })
              });
        })
    })
});

describe("GET /api/articles/", () => {
  test("Status 200", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
  });
  test("returns an array of objects with the correct properties", () => {
    return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).toEqual(
              expect.objectContaining({
                author:     expect.any(String),
                title:      expect.any(String),
                article_id: expect.any(Number),
                topic:      expect.any(String),
                created_at: expect.any(String),
                votes:      expect.any(Number)
              })
            );
            expect(article).toEqual(
              expect.not.objectContaining({
                body: expect.any(String)
              })
            )
          })
      })
  })
  test("Array is sorted by date created in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', { descending: true })
      })
  });
  test("each object includes comment_count property", () => {
    return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count:     expect.any(Number)
              })
            )
          })
          expect(body.articles[0].comment_count).toBe(11)
          expect(body.articles[1].comment_count).toBe(0)
          expect(body.articles[2].comment_count).toBe(2)
          expect(body.articles[8].comment_count).toBe(2)
      })
  })
});

describe("GET /api/articles queries", () => {
  test("Status 200", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
  });
  test("Accepts 'sort_by' queries, returning articles ordered by the specified category", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body })=>{
        expect(body.articles).toBeSortedBy('title', { descending: true })
      })
  });
  test("Accepts 'order' queries, returning articles ordered in the specified pattern", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body })=>{
        expect(body.articles).toBeSortedBy('created_at', { descending: false })
      })
  });
  test("Accepts 'topic' queries, returning articles with specified topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body })=>{
        expect(body.articles.length).toBe(1)
        body.articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: 'cats'
            })
          )
        })
      })
  });
  test("Accepts combined queries", () => {
    return request(app)
      .get("/api/articles?order=asc&sort_by=title")
      .expect(200)
      .then(({ body })=>{
        expect(body.articles).toBeSortedBy('title', { descending: false })
      })
  });
  test("Accepts combined queries with 'topic'", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order=asc&sort_by=title")
      .expect(200)
      .then(({ body })=>{
        expect(body.articles.length).toBe(11)
        expect(body.articles).toBeSortedBy('title', { descending: false })
        body.articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: 'mitch'
            })
          )
        })
      })
    });
  test("Status 400 when incorrect sort data given", () => {
    return request(app)
      .get("/api/articles?sort_by=cooking_time")
      .expect(400)
      .then(({ body })=>{
        expect(body.msg).toBe("Bad Request")
      })
    });
  test("Status 400 when incorrect order data given", () => {
    return request(app)
      .get("/api/articles?order=vertical")
      .expect(400)
      .then(({ body })=>{
        expect(body.msg).toBe("Bad Request")
      })
    });
  test("Returns default list if query is formatted incorrectly", () => {
    return request(app)
      .get("/api/articles?topicmitchorderascsortbytitle")
      .expect(200)
      .then(({ body })=>{
        expect(body.articles.length).toBe(12)
        body.articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              author:         expect.any(String),
              title:          expect.any(String),
              article_id:     expect.any(Number),
              topic:          expect.any(String),
              created_at:     expect.any(String),
              votes:          expect.any(Number),
              comment_count:  expect.any(Number)
            })
          )
        })
    })
  });
});

let newArticle = {
  "title": "How to create new articles on the new website NC-News",
  "author": "lurker",
  "body": "Press buttons then do the tip tap noise",
  "topic": "cats",
}

describe('POST /api/articles', () => {
  test('Status 201', () => {
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
  });
  test('Status 201', () => {
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
    .then(({ body })=>{
      expect(body.article).toEqual({
        'title': newArticle.title,
        'author': newArticle.author,
        'body': newArticle.body ,
        'topic': newArticle.topic,
        'article_id': 13,
        'votes': 0,
        'created_at': expect.any(String),
        'comment_count': 0,
      })
    })
  });
  test('POST adds a new article each time', () => {
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
    .then((data)=>{
      return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body })=>{
        expect(body.article.article_id).toBe(14)
      })
    });
  });
  test('Status 400 when username is not in "users" database', () => {
    const newArticleBadUser = {...newArticle}
    newArticleBadUser.author = 'notInUsers'
    return request(app)
      .post("/api/articles/")
      .send(newArticleBadUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test('Status 400 when topic is not in "topics" database', () => {
    const newArticleBadTopic = {...newArticle}
    newArticleBadTopic.topic = 'notInTopics'
    return request(app)
      .post("/api/articles/")
      .send(newArticleBadTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test('New article can be called by a GET request', () => {
    return request(app)
      .post("/api/articles/")
      .send(newArticle)
      .expect(201)
      .then(() => {
        return request(app)
        .get("/api/articles/13")
        .expect(200)
        .then(({body}) => {
          expect(body.article).toEqual({
            'title': newArticle.title,
            'author': newArticle.author,
            'body': newArticle.body ,
            'topic': newArticle.topic,
            'article_id': 13,
            'votes': 0,
            'created_at': expect.any(String),
            'comment_count': 0,
          })
        })
      })
  });
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
          .then(({ body }) => {
            expect(body.article).toEqual(
              expect.objectContaining({
                  article_id: 3,
                  title: "Eight pug gifs that remind me of mitch",
                  topic: "mitch",
                  author: "icellusedkars",
                  body: "some gifs",
                  created_at: '2020-11-03T09:12:00.000Z',
                  votes: 0,
                })
            )
          })
    });
    test("returns an object including the 'comment count' property", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
                comment_count: 2,
              })
          )
        })
    });
    test("Status 404 when valid but non-existant :article_id", () => {
      return request(app)
        .get("/api/articles/4321567")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID, no data found")
        })
    });
    test("Status 400 when invalid :article_id", () => {
      return request(app)
        .get("/api/articles/notanID")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request")
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
      .then(({ body }) => {
        expect(Object.keys(body.article)).toHaveLength(7);
        expect(body.article).toEqual({
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
          .then(({ body }) => {
            expect(body.article.votes).toBe(-99)
          })
      })
  })
  test("Status 404 when valid but non-existant :article_id", () => {
    return request(app)
      .patch("/api/articles/4321567")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, no data found")
      })
  });
  test("Status 400 when invalid :article_id", () => {
    return request(app)
      .patch("/api/articles/potato")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test("Status 400 when invalid data sent", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ incVotes: "bad data" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test("Status 400 when no data sent", () => {
    return request(app)
      .patch("/api/articles/3")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test("Status 400 when incorrect PATCH data sent", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ hammerthekeyboard: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
});

describe.only("DELETE /api/articles/:article_id", () => {
  test('Status 204', () => {
    return request(app)
      .delete('/api/articles/1')
      .expect(204)
  });
  test('Responds with an empty body', () => {
    return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({})
        })
  });
  test('Status 404 for GET requests for deleted article id', () => {
    return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then(() => {
          return request(app)
          .get("/api/articles/1")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid ID, no data found')
          })
        })
  });
  test('Status 404 when valid id but no article', () => {
    return request(app)
        .delete("/api/articles/97")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('No article to delete')
        })
  });
  test('Status 404 when invalid comment id', () => {
    return request(app)
        .delete("/api/article/notanarticlenumber")
        .expect(404)
        .then(({error}) => {
          expect(error.text).toBe('Path not found!')
        })
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status 200", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      })
  test("Returns an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              'comment_id': expect.any(Number), 
              'votes': expect.any(Number), 
              'created_at': expect.any(String), 
              'author': expect.any(String), 
              'body': expect.any(String)
            })
          )
        })
      })
  });
  test("Status 204 if no comments for article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(204)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("No Content")
      })
  });
  test("Status 404 when valid but non-existant :article_id", () => {
    return request(app)
      .get("/api/articles/4321567/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, no data found")
      })
  });
  test("Status 400 when invalid :article_id", () => {
    return request(app)
      .get("/api/articles/notanID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
});

let newComment = { 'username': 'lurker' , 'body': 'this is a test comment' };

describe('POST /api/articles/:article_id/comments', () => {
  test('Status 201', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
  });
  test('Responds with the posted comment', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({ 
          'author': 'lurker', 
          'body': 'this is a test comment',
          'created_at': expect.any(String),
          'article_id': 2,
          'votes': 0,
          'comment_id': 19
        })
      })
  });
  test('POST method adds a new comment each time', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.comment_id).toBe(20)
          })
      });
  });
  test('Status 400 when username is not in "users" database', () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ 'username': 'notInUsers' , 'body': 'this is a test comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test('Status 404 when valid but non-existant :article_id', () => {
    return request(app)
      .post("/api/articles/4321567/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, no data found")
      })
  });
});

describe('PATCH /api/comments/:comment_id', () => { 
  test('Status 200', () => {
    return request(app)
      .patch('/api/comments/1')
      .send(newVotes)
      .expect(200)
  });
  test("Returns the updated comment", () => {
    return request(app)
      .patch('/api/comments/1')
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: -84,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          },
        );
      });
  })
  test("Runs multiple times", () => {
    return request(app)
      .patch('/api/comments/1')
      .send(newVotes)
      .expect(200)
      .then(() => {
        newVotes.incVotes = 101;
        return request(app)
          .patch('/api/comments/1')
          .send(newVotes)
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).toBe(17)
          })
      })
  })
  test("Status 404 when valid but non-existant :comment_id", () => {
    return request(app)
      .patch("/api/comments/4321567")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, no data found")
      })
  });
  test("Status 400 when invalid :comment_id", () => {
    return request(app)
      .patch('/api/comments/potato')
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test("Status 400 when invalid data sent", () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ incVotes: "bad data" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test("Status 400 when no data sent", () => {
    return request(app)
      .patch("/api/comments/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
  test("Status 400 when incorrect PATCH data sent", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ hammerthekeyboard: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('Status 204', () => {
    return request(app)
        .delete("/api/comments/15")
        .expect(204)
  });
  test('Responds with an empty body', () => {
    return request(app)
        .delete("/api/comments/15")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({})
        })
  });
  test('GET requests show updated comment counts', () => {
    return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(1)
          })
        })
  });
  test('Status 404 when valid id but no comment', () => {
    return request(app)
        .delete("/api/comments/97")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('No comment to delete')
        })
  });
  test('Status 400 when invalid comment id', () => {
    return request(app)
        .delete("/api/comments/9or7")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad Request')
        })
  });
});

describe("GET /api/users", () => {
  test("Status 200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
  });
  test("returns an array of objects, each with the property 'username'", () => {
      return request(app)
          .get("/api/users")
          .expect(200)
      .then(({ body }) => {
          expect(Array.isArray(body.usernames)).toBe(true)
          body.usernames.forEach((user) => {
            expect(user).toEqual(expect.any(String)
            )
          })
      })
  })
}); 

describe('GET /api/users/:username', () => {
  test('Status 200', () => {
    return request(app)
      .get('/api/users/lurker')
      .expect(200)
  });
  test('Returns the selected user with the correct properties', () => {
    return request(app)
      .get('/api/users/lurker')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
            username: 'lurker',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            name: 'do_nothing'
        })
      })
  });
  test('Status 404 when username is not on record', () => {
    return request(app)
      .get('/api/users/staceycoils')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No username on record")
      })
  });
});