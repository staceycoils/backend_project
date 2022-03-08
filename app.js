const express = require("express");
const cors = require('cors');

const {
    getApi
} = require('./utils')
const { 
    getArticles,
    getArticle,
    patchArticle,
    getArtComments,
    postArtComments,
} = require('./controllers/controllers_articles.js');
const { 
    getTopics
} = require('./controllers/controllers_topics.js');
const { 
    getUsers,
    getUser
} = require('./controllers/controllers_users.js');
const { 
    patchComment,
    deleteComment
} = require('./controllers/controllers_comments.js');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api', getApi)

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles/:article_id/comments", getArtComments);
app.post("/api/articles/:article_id/comments", postArtComments);

app.patch("/api/comments/:comment_id", patchComment);
app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers)
app.get("/api/users/:username", getUser)

app.use("/*", (req,res) => {
    res.status(404).send("Path not found!")
})

app.use((err,req,res,next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ 'msg': err.msg });
    } else if (err.code !== 'undefined') {
        res.status(400).send({ 'msg': 'Bad Request' })
    } else {
        res.status(500).send({ 'msg': 'Internal Server Error' })
    }
})

module.exports = app;


