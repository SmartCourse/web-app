const express = require('express')
const review = express.Router({ mergeParams: true })
const reviewController = require('../controllers/review')
<<<<<<< HEAD
=======
const commentController = require('../controllers/comment')
>>>>>>> dev
const { isAuthorized } = require('../utils/helpers')

/* Get the review data for a specific review id */
review.get('/:id', reviewController.getReview)

/* Get page (N) replies for a review */
review.get('/:id/comments', reviewController.getReviewComments)

/* Get the like value */
review.get('/:id/likes', reviewController.getReviewLikes)

/* Get the review's reply like value */
<<<<<<< HEAD
review.get('/:id/reply/:replyID/likes', reviewController.getReplyLikes)
=======
review.get('/:id/comment/:replyID/likes', reviewController.getReplyLikes)

/* Get an answer for a given question */
review.get('/:id/comment/:cid', commentController.getComment)
>>>>>>> dev

/* full auth check */
review.use(isAuthorized)

/* Post a comment for a given review */
review.post('/:id/comment', reviewController.postComment)

/* Put an updated like value */
review.put('/:id/likes', reviewController.putReviewLikes)

/* Put an updated review's reply like value */
review.put('/:id/comment/:replyID/likes', reviewController.putReplyLikes)

/* Put an updated like value */
review.put('/:id/likes', reviewController.putReviewLikes)

/* Put an updated review's reply like value */
review.put('/:id/reply/:replyID/likes', reviewController.putReplyLikes)

module.exports = review
