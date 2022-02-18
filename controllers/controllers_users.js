const {
    fetchUsers
} = require('../models/models_users.js')

function getUsers(req,res,next) {
    fetchUsers()
    .then((data) => {
        res.status(200).send({ 'usernames': data})
    })
}

module.exports = {
    getUsers
} 