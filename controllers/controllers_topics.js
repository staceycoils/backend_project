const {
    fetchTopics,
    createTopic
 } = require('../models/models_topics.js')


function getTopics(req,res,next) {
    fetchTopics()
        .then((data) => {
            res.status(200).send({ 'topics': data })
        })
        .catch(next)
}

function postTopic(req,res,next) {
    createTopic(req.body.slug,req.body.description)
        .then((data)=>{
            res.status(201).send({ 'topic': data })
        })
        .catch(next)
}

module.exports = {
    getTopics,
    postTopic
}