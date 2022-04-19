const usersRouter = require('express').Router();
const { 
    getUsers,
    getUser,
    getUserArticles
} = require('../controllers/controllers_users.js');

usersRouter.get("/", getUsers)
usersRouter.get("/:username", getUser)
usersRouter.get("/:username/articles", getUserArticles)

module.exports = usersRouter;