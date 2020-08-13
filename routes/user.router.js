const {Router} = require('express')
const router = Router()
const User = require('../models/userModel')
const {registerValidation, loginValidation} = require('../validation/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.json({error: error.details[0].message})
    const {username, email, password} = req.body
    const existed = await User.findOne({email})
    if (existed) return res.json({error: 'User is already existed'})  

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await new User({
      username, email, password: hashPassword
    })
    await newUser.save()
    res.json("You've successfuly registered")
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  } 
})

router.post('/login', async (req, res) => {
  try {
    const {error} = loginValidation(req.body)
    if (error) return res.json({error: error.details[0].message});
    const {email, password} = req.body
    const existed = await User.findOne({email})
    if (!existed) return res.json({error: "You're not registered yet. Please sign up"})
    const compared = await bcrypt.compare(password, existed.password)
    if (!compared) return res.json({error: 'Your email or password is incorrect'})

    const token = jwt.sign({userId: existed._id, username: existed.username}, process.env.SECRET_KEY, {expiresIn: '1h'})
    res.header('authtoken', token).json({token, userId: existed._id})
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
})

module.exports = router