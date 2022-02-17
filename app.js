const express = require("express");

const { 
<<<<<<< HEAD
    getTopics, 
    getArticles,
    patchArticle
} = require('./controllers/controllers.js');
=======
    getArticles,
    getArticle
} = require('./controllers/controllers_articles.js');
const { 
    getTopics
} = require('./controllers/controllers_topics.js');
>>>>>>> 1bd41834b6ccddb43ddb7dcdd7d4ef59c29b99cb

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

<<<<<<< HEAD
app.get(/^\/api\/articles/, getArticles);
app.patch(/^\/api\/articles/, patchArticle)
=======
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
>>>>>>> 1bd41834b6ccddb43ddb7dcdd7d4ef59c29b99cb

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


