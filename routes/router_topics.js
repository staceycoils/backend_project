const topicsRouter = require('express').Router();
const { 
    getTopics,
    postTopic
} = require('../controllers/controllers_topics.js');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', postTopic);

module.exports = topicsRouter;