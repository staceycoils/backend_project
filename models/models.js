const db = require('../db/connection.js')

function fetchTopics() {
    return db.query("SELECT * FROM topics")
        .then((data) => {
            return data.rows
        })
}

module.exports = fetchTopics;