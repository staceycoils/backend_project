const db = require('../db/connection.js')

function fetchTopics() {
    return db.query("SELECT * FROM topics;")
        .then((data) => {
            return data.rows
        })
}

function createTopic(slug, desc) {
    if (!slug||!desc) return Promise.reject({status: 400, msg: 'Incomplete Topic'})
    return db.query(`INSERT INTO topics (slug, description)
                    VALUES ( '${slug}', '${desc}')
                    RETURNING * ;`)
        .then((data)=>{
            return data.rows[0]
        })
}

module.exports = {
    fetchTopics,
    createTopic
};