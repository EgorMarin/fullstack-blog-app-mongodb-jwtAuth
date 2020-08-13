const {Schema, model} = require('mongoose')

const postSchema = new Schema({
  username: {type: String, required: true},
  text: {type: String, required: true},
  userId: {type: String, required: true}
}, {
  timestamps: true
})

module.exports = model('Post', postSchema)