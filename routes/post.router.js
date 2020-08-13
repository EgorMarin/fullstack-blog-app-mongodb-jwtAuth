const {Router} = require('express')
const Post = require('../models/postModel')
const auth = require('../middlewares/verifyToken')
const {textValidation} = require('../validation/validation')
const router = Router()

//  Redis client
// const redis = require("redis");
// const client = redis.createClient(6379)
// const cache = require('../middlewares/redisCache')


router.get('/:index', async (req, res) => {
  try {
    const {index} = req.params
    const count = await (await Post.find()).length
    const posts = await Post.find().skip(9 * index).limit(9).sort({'updatedAt': -1})

    //redis set cache
    // client.setex(index, 3600, JSON.stringify({posts, count}))

    res.json({posts, count})
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
})

router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.json({error: "Post doesn't exist"})
    res.json(post)
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
})

router.post('/create', auth, async (req, res) => {
  try {
    const { text } = req.body
    const { username, userId } = req.user
    const { error } = textValidation({username, text, userId})
    if (error) return res.json({error: error.details[0].message})
    
    const newPost = new Post({
      username, text, userId
    })
    await newPost.save()
    res.json(newPost)
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
})

router.post('/edit/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.json({error: "Post doesn't exist"})
    if (post.userId !== req.user.userId) return res.json({error: "You can't change it because you aren't creater!"})
    post.text = req.body.text
    await post.save()
    res.json(post )
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
})

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post.userId !== req.user.userId) return res.json({error: "You can't delete it because you aren't creater!"})
    const deleted = await Post.findByIdAndDelete(req.params.id)
    if (!deleted) return res.json({error: 'Oops! Smth went wrong with deleting this post...'} )
    res.json("You've deleted your post")
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
})

module.exports = router