const db = require('../db/connection.js')

function fetchUsers() {
    return db.query("SELECT username FROM users;")
        .then((data) => {
            let users = []
            data.rows.forEach((user) => {
                users.push(user.username)
            })
            return users
        })
}

module.exports = {
    fetchUsers
}; 