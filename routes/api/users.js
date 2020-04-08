const router = require('express').Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const User = require('../../models/User')

const keys = require('../../config/keys')

const validateRegister = require('../../validation/register')
const validateLogin = require('../../validation/login')

// @route GET api/users/test
// @desc  Test users route
// @access Public   
router.get('/test', (req, res) => res.json({ msg: 'Users Work' }))

// @route GET api/users/register
// @desc  Register User
// @access Public   
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegister(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  await User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' })
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'x',  // Rating
        d: 'retro'    // Default
      }, false)

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @route GET api/users/login
// @desc  Login User / Return JWT Token
// @access Public  
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLogin(req.body)
  const { email, password } = req.body

  if (!isValid) {
    return res.status(400).json(errors)
  } else {
    // Find user by email
    await User.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'Email not found' })
      } else {
        // Check password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) { // User matched
              const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
              }

              // Sign Token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 10 * 1000 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  })
                })
            } else {
              return res.status(400).json({ password: 'Password incorrect' })
            }
          })
      }
    })
  }
})

// @route GET api/users/current
// @desc  Return current user
// @access Private 
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router