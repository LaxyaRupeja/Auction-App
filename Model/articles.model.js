const mongoose = require('mongoose');
const articlesSchema = mongoose.Schema({
    title: String,
    body: String,
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]

}, {
    versionKey: false
})
const ArticleModel = mongoose.model("blogArt", articlesSchema)
module.exports = { ArticleModel }