const {
    fetchArticles,
    fetchArticle,
    alterArticle,
    fetchArtComments,
    addArtComments
} = require('../models/models_articles.js')

function getArticles(req,res,next) {
    fetchArticles()
    .then((data) => {
        res.status(200).send({ 'articles': data })
    })
}

function getArticle(req,res,next) {
    let index = (req.params.article_id)
    fetchArticle(index)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

function patchArticle(req,res,next) {
    let index = (req.params.article_id)
    let voteChange = req.body.incVotes
    alterArticle(index,voteChange)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

function getArtComments(req,res,next) {
    let index = (req.params.article_id)
    fetchArtComments(index)
    .then((data) => {
        res.status(200).send(data)
    })
    .catch(next)
}

function postArtComments(req,res,next) {
    let index = (req.params.article_id)
    addArtComments(index, req.body)
    .then((data) => {
        res.status(201).send(data)
    })
    .catch(next)
}

module.exports = {
    getArticles,
    getArticle,
    patchArticle,
    getArtComments,
    postArtComments
}