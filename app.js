const express = require("express");

const { 
    getArticles,
    getArticle,
    patchArticle
} = require('./controllers/controllers_articles.js');
const { 
    getTopics
} = require('./controllers/controllers_topics.js');

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);

app.use("/*", (req,res) => {
    res.status(404).send("Path not found!")
})

app.use((err,req,res,next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ 'msg': err.msg });
    } else if (err.code !== 'undefined') {
        res.status(400).send({ 'msg': 'Bad Request' })
    } else {
        console.log(err);
        res.status(500).send({ 'msg': 'Internal Server Error' })
    }
})

module.exports = app;


