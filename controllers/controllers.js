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
    if (req.path.endsWith("articles")) {
        fetchArticles()
        .then((data) => {
            res.status(200).send(data)
        })
    } else {
        let index = ((req.path).slice(14))
        fetchArticle(index)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch(() => {
            res.status(404).send("Non-valid id")
        })
    }
}

module.exports = {
    getTopics,
    getArticles
}