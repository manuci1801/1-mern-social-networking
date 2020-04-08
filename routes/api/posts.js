const router = require('express').Router()
const passport = require('passport')

const Post = require('../../models/Post')

const validatePost = require('../../validation/post')

// @route GET api/posts/test
// @desc Test post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Work' }))


// @route GET api/posts
// @desc Get all posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ posts: 'Not posts found' }))
})

// @route GET api/posts/:id
// @desc Get a post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ posts: 'No post found' }))
})

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePost(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    text: req.body.text,
    user: req.user.id,
    name: req.user.name,
    avatar: req.user.avatar
  })
  // Save
  newPost.save().then(post => res.json(post))
})

// @route DETELE api/posts/:id
// @desc Delete a post by id
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ authorization: 'User not authorized' })
      }
      //Remove
      post.remove().then(() => res.json({ success: true }))
    })
    .catch(err => res.status(404).json({ post: 'Not found post' }))
})

// @route POST api/posts/like?:id
// @desc Like a post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ alreadyliked: 'User already liked this post' })
      }
      // Add user id to likes array
      post.likes.unshift({ user: req.user.id })
      // Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
})

// @route POST api/posts/unlike?:id
// @desc Unlike a post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ alreadyliked: 'User have not yet like post' })
      }
      // Get remove index and splice
      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
      post.likes.splice(removeIndex, 1)
      // Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
})

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePost(req.body)
  // Check error input
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id
      }
      // Add comment to array
      post.comments.unshift(newComment);
      // Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
})

// @route   DELETE api/posts/comment/:postID/:commentID
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:postID/:commentID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.postID)
    .then(post => {
      // Check to see if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.commentID).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' })
      }
      const comment = post.comments.filter(comment => comment.id.toString() === req.params.commentID)[0]
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ comment: 'User not authorized to delete comment' })
      }
      // Get remove index
      const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.commentID)
      // Splice comment out of array
      post.comments.splice(removeIndex, 1)
      //Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
}
)

module.exports = router