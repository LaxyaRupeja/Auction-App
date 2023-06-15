const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const { ArticleModel } = require('./Model/articles.model');
const { CommentModel } = require('./Model/comment.model');
app.use(express.json())
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {
    console.log("user connected")
    io.emit("msg", await ArticleModel.find().populate("replies"))
    // console.log(await ArticleModel.find())
    socket.on("reply", (comment) => {
        socket.emit("Laksh", comment)
    })
    socket.on("comment", async (msg) => {
        let article = await ArticleModel.findById(msg.id);
        let comm = new CommentModel({ comment: msg.comment, blogID: msg.id });
        console.log(comm)
        await comm.save();
        console.log(article);
        article.replies.push(comm._id);
        await ArticleModel.findByIdAndUpdate(msg.id, article);
        io.emit("msg", await ArticleModel.find().populate("replies"))
    })
    socket.on('commentrep', async (msg) => {
        let com = await CommentModel.findById(msg.id);
        com.replies.push(msg.rep);
        await CommentModel.findByIdAndUpdate(msg.id, com);
        io.emit("msg", await ArticleModel.find().populate("replies"))
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
app.post("/addBlog", async (req, res) => {
    // console.log(req.body)
    await ArticleModel.insertMany(req.body);
    res.send("Blog added")
})
server.listen(3000, () => {
    mongoose.connect(
        'mongodb+srv://laxya:laksh@cluster0.zwu6tqa.mongodb.net/NewBlogs?retryWrites=true&w=majority');
    console.log('listening on *:3000');
});