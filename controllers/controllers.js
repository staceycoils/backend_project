const {
    fetchTopics,
    fetchArticles,
    fetchArticle
 } = require('../models/models.js')


function getTopics(req,res) {
    fetchTopics()
        .then((data) => {
            res.status(200).send(data)
        })
}

function getArticles(req,res,next) {
    fetchArticles()
    .then((data) => {
        res.status(200).send(data)
    })
}

function getArticle(req,res,next) {
    let index = (req.params.article_id)
    fetchArticle(index)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(() => {
        res.status(404).send("Non-valid id")
    })
}

module.exports = {
    getTopics,
    getArticles,
    getArticle
}