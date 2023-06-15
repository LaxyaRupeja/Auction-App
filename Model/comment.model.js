const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    comment: String,
    blogID: { type: mongoose.Schema.Types.ObjectId, ref: 'blogArt' },
    replies: []
}, {
    versionKey: false
})
const CommentModel = mongoose.model("comment", commentSchema)
module.exports = { CommentModel }