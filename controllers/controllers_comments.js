const {
    alterComment,
    removeComment
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

module.exports = {
    patchComment,
    deleteComment
} 