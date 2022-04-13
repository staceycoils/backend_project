const {
    alterComment,
    removeComment,
    fetchArtComments,
    addArtComments
} = require('../models/models_comments.js')

function patchComment(req,res,next) {
    const index = req.params.comment_id
    const voteChange = req.body.incVotes
    alterComment(index, voteChange)
    .then((data) => {
        res.status(200).send({'comment': data})
    })
    .catch(next)
}

function deleteComment(req,res,next) {
    index = req.params.comment_id
    removeComment(index)
    .then((data) => {
        res.status(204).send({data})
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
    patchComment,
    deleteComment,
    getArtComments,
    postArtComments
}