const {
    removeComment
} = require('../models/models_comments.js')

function deleteComment(req,res,next) {
    index = req.params.comment_id
    removeComment(index)
    .then((data) => {
        res.status(204).send({data})
    })
    .catch(next)
}

module.exports = {
    deleteComment
} 