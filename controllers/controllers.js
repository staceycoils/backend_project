const {
    fetchTopics,
    fetchArticles,
    fetchArticle,
    alterArticle
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
        fetchArticle(index-1)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch(() => {
            res.status(404).send("Non-valid id")
        })
    }
}

function patchArticle(req,res,next) {
    let index = (((req.path).slice(14)))
    alterArticle(index,req.body.incVotes)
    .then((data) => {
        res.status(200).send(data)
    })
}

module.exports = {
    getTopics,
    getArticles,
    patchArticle
}