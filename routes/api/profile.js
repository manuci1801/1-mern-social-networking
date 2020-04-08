const router = require('express').Router()
const passport = require('passport')

const User = require('../../models/User')
const Profile = require('../../models/Profile')

const validateProfile = require('../../validation/profile')
const validateExperience = require('../../validation/experience')
const validateEducation = require('../../validation/education')

// @route GET api/profile/test
// @desc  Test profile route
// @access Public  
router.get('/test', (req, res) => res.json({ msg: 'Profile Work' }))

// @route GET api/profile
// @desc  Get current user profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ profile: 'There is no profile for user' })
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route GET api/profile/handle/:handle
// @desc  Get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ profile: 'There is no profile for user' })
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for user' }))
})

// @route GET api/profile/user/:user_id
// @desc  Get profile by user_id
// @access Public
router.get('/user/:userID', (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ profile: 'There is no profile for user' })
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})


// @route GET api/profile/all
// @desc  Get all profiles
// @access Public
router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ profile: 'There is no profile' })
      }

      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route POST api/profile
// @desc  Create or Edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfile(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const profileFields = {}

  // Get fields
  profileFields.user = req.user.id
  profileFields.handle = req.body.handle
  profileFields.company = req.body.company
  profileFields.website = req.body.website
  profileFields.location = req.body.location
  profileFields.status = req.body.status
  profileFields.bio = req.body.bio
  profileFields.githubUsername = req.body.githubUsername

  // Skills - Split into array
  if (typeof (req.body.skills) !== 'undefined') {
    profileFields.skills = req.body.skills.split(',')
  }
  profileFields.social = {}
  // Social
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update profile
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile))
          .catch(err => res.status(400).json(err))
      } else {
        // Create new profile
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(p => {
          if (p) {
            return res.status(400).json({ handle: 'That handle already exists' })
          }
          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile))
        })
      }
    })
})

// @route POST api/profile/experience
// @desc  Post experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperience(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      const newExperience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      // Add experience to profile
      profile.experience.unshift(newExperience)

      // Save profile
      profile.save().then(profile => res.json(profile))
    })
})

// @route POST api/profile/education
// @desc  Post education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducation(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        major: req.body.major,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      // Add education to profile
      profile.education.unshift(newEducation)

      // Save profile
      profile.save().then(profile => res.json(profile))
    })
})

// @route DELETE api/profile/experience/:exp_id
// @desc  Delete experience from profile
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const indexRemove = profile.experience.map(exp => exp._id).indexOf(req.params.exp_id)
      // Delete experience
      if (indexRemove >= 0) {
        profile.experience.splice(indexRemove, 1)
      }

      // Save new profile
      profile.save().then(profile => res.json(profile))
    })
})


// @route DELETE api/profile/education/:edu_id
// @desc  Delete education from profile
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const indexRemove = profile.education.map(edu => edu._id).indexOf(req.params.edu_id)
      // Delete experience
      if (indexRemove >= 0) {
        profile.education.splice(indexRemove, 1)
      }
      // Save new profile
      profile.save().then(profile => res.json(profile))
    })
})

// @route DELETE api/profile
// @desc  Delete profile and user
// @access Private
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id })
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({
      success: true
    })
  } catch (err) {
    res.status(404).json(err)
  }
})


module.exports = router