const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const bcrypt = require('bcrypt')
const SALT = parseInt(process.env.SALT_ROUNDS, 10)

const User = mongoose.Schema({
  name: {
    first: String,
    last: String
  },
  username: {
    type: String,
    lowercase: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  saved_articles: [{
    type: ObjectId,
    ref: 'Article'
  }],
  account_type: {
    free: Boolean,
    paid: Boolean
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  twitter: {
    id: String,
    token: String,
    tokenSecret: String,
    twittername: String,
    displayName: String
  },
  facebook: {
    id: String,
    accessToken: String,
    refreshToken: String,
    fbname: String,
    displayName: String
  },
  google: {
    id: String,
    token: String,
    displayName: String
  }
})

User.pre('save', function (next) {
  let user = this
  if (!user.password) {
    next()
  } else {
    bcrypt.hash(user.password, SALT, (err, hashed) => {
      if (err) throw new Error(err)

      user.password = hashed
      next()
    })
  }
})

User.methods.checkPassword = (user, potentialPassword) => {
  return new Promise((resolve, reject) => {
    return bcrypt.compare(potentialPassword, user.password)
      .then((isMatch) => {
        resolve(isMatch)
      }).catch((err) => reject(err))
  }).catch((err) => err)
}

module.exports = mongoose.model('User', User)
