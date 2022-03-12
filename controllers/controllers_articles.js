const {
    fetchArticles,
    addArticle,
    fetchArticle,
    alterArticle,
    removeArticle,
    fetchArtComments,
    addArtComments
} = require('../models/models_articles.js')

function getArticles(req,res,next) {
    fetchArticles(req.query, req.query.limit, req.query.p)
    .then((data) => {
        res.status(200).send({ 'articles': data[0], 'total_count': data[1] })
    })
    .catch(next)
}

function postArticle(req,res,next) {
    addArticle(req.body)
    .then((data) => {
        res.status(201).send({ 'article': data })
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

function deleteArticle(req,res,next) {
    let index = (req.params.article_id)
    removeArticle(index)
    .then(()=>{
        res.status(204).send({})
    })
    .catch(next)
}

function getArtComments(req,res,next) {
    let index = (req.params.article_id)
    fetchArtComments(index, req.query.limit, req.query.p)
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
    postArticle,
    getArticle,
    patchArticle,
    deleteArticle,
    getArtComments,
    postArtComments
}