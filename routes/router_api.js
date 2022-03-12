const express = require('express');
const apiRouter = express.Router();
const articlesRouter = require('./router_articles');
const commentsRouter = require('./router_comments');
const topicsRouter = require('./router_topics');
const usersRouter = require('./router_users');
const {
    getApi
} = require('../utils')

apiRouter.get('/', getApi)

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;