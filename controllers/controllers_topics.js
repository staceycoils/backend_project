const {
    fetchTopics,
 } = require('../models/models_topics.js')


function getTopics(req,res) {
    fetchTopics()
        .then((data) => {
            res.status(200).send(data)
        })
}

module.exports = {
    getTopics
}