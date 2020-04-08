const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')

const usersRoute = require('./routes/api/users')
const profileRoute = require('./routes/api/profile')
const postsRoute = require('./routes/api/posts')

const app = express()

//DB config
const db = require('./config/keys').mongoURI
//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

//Use Routes
app.use('/api/users', usersRoute)
app.use('/api/profile', profileRoute)
app.use('/api/posts', postsRoute)

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))