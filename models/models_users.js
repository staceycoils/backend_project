const db = require('../db/connection.js')

function fetchUsers() {
    return db.query("SELECT username FROM users WHERE username NOT LIKE 'NULL';")
        .then((data) => {
            return data.rows
        })
}

module.exports = {
    fetchUsers
}; 