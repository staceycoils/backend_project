const articlesRouter = require('express').Router();
const { 
    getArticles,
    postArticle,
    getArticle,
    patchArticle,
    deleteArticle,
} = require('../controllers/controllers_articles.js');
const { 
    getArtComments,
    postArtComments
} = require('../controllers/controllers_comments.js');

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.delete("/:article_id", deleteArticle);
articlesRouter.get("/:article_id/comments", getArtComments);
articlesRouter.post("/:article_id/comments", postArtComments);

module.exports = articlesRouter;