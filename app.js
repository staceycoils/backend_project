const express = require("express");
const cors = require('cors');
const apiRouter = require('./routes/router_api');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);

app.use("/*", (req,res) => {
    res.status(404).send("Path not found!")
})

app.use((err,req,res,next) => {
    console.log(err)
    if (err.status && err.msg) {
        res.status(err.status).send({ 'msg': err.msg });
    } else if (err.code !== 'undefined') {
        res.status(400).send({ 'msg': 'Bad Request' })
    } else {
        res.status(500).send({ 'msg': 'Internal Server Error' })
    }
})

module.exports = app;


