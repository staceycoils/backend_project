const commentsRouter = require('express').Router();
const { 
    patchComment,
    deleteComment,
    getNewComment
} = require('../controllers/controllers_comments.js');

commentsRouter.get("/", getNewComment);
commentsRouter.patch("/:comment_id", patchComment);
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;