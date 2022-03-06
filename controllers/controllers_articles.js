const {
    fetchArticles,
    fetchArticle,
    alterArticle,
    fetchArtComments,
    addArtComments
} = require('../models/models_articles.js')

function getArticles(req,res,next) {
    fetchArticles(req.query)
    .then((data) => {
        res.status(200).send({ 'articles': data })
    })
    .catch(next)
}

function getArticle(req,res,next) {
    let index = (req.params.article_id)
    fetchArticle(index)
    .then((data) => {
        res.status(200).send({ 'article': data })
    })
    .catch(next)
}

function patchArticle(req,res,next) {
    let index = (req.params.article_id)
    let voteChange = req.body.incVotes
    alterArticle(index,voteChange)
    .then((data) => {
        res.status(200).send({ 'article': data })
    })
    .catch(next)
}

function getArtComments(req,res,next) {
    let index = (req.params.article_id)
    fetchArtComments(index)
    .then((data) => {
        res.status(200).send({ 'comments': data })
    })
    .catch(next)
}

function postArtComments(req,res,next) {
    let index = (req.params.article_id)
    addArtComments(index, req.body)
    .then((data) => {
        res.status(201).send({ 'comment': data })
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