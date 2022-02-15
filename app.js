const express = require("express");

const { 
    getTopics, 
    getArticles,
    getArticle
} = require('./controllers/controllers.js');

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);

app.use("/*", (req,res) => {
    res.status(404).send("Path not found!")
})

app.use((err,req,res,next) => {
    console.log(err)
})

module.exports = app;

