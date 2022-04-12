const createError = require('http-errors')
const User = require('../models/User.model')
const Stripe = require('stripe')
require('../models/Post.model')

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .populate('posts')
    .then(user => {
        if (!user) {
          // not found
          next(createError(404, 'User not found'))
        } else {
          res.status(200).json(user)
        }
      })
    .catch(next)
}


module.exports.list = (req, res, next) => {
  User.find()
    .populate('posts')
    .then(users => {
        if (!users) {
          res.status(200).json([])
        } else {
          res.status(200).json(users)
        }
      })
    .catch(next)
}


module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.currentUser)
    .populate({path: 'posts', options:{ sort: [{"posts": "desc"}] }})
    .sort({ posts: "desc" })
    .then(user => {
      if (!user) {
        // not found
        next(createError(404, 'User not found'))
      } else {
        res.status(200).json(user)
      }
    })
    .catch(next)
}

module.exports.checkout = (req, res, next) => {
  const stripe = new Stripe("sk_test_IFN1CA1z1Ng1EkL9it3BTWhu")

  const { id, amount } = req.body

  stripe.paymentIntents.create({
    amount,
    currency: "USD",
    description: "id del producto",
    payment_method: id,
    confirm: true
  })
  .then(result => res.status(200).json({ message: "confirmed!", result }))
  .catch(next)

}