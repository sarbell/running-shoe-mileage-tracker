const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken') 
const AUTH_TOKEN_EXPIRES_IN = 1 // days
const APP_SECRET = "my_secret_for_this_app_which_needs_to_change_later"

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String, 
    unique: true, 
    required: true, 
  },
  name: {
    type: String, 
    unique: false, 
    required: true, 
  },
  email: {
    type: String, 
    unique: true, 
    required: true, 
  },
  added_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  hash: String,
  salt: String

})

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'sha512').toString('hex')
}

userSchema.methods.isValidPassword = function(password){
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'sha512').toString('hex')
    return this.hash === hash
}

userSchema.methods.generateJWT = function(){
    let expireOn = new Date()
    expireOn.setDate(expireOn.getDate() + AUTH_TOKEN_EXPIRES_IN)

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        username: this.username,
        exp: parseInt(expireOn.getTime() / 1000)
    }, APP_SECRET)
}

const User = mongoose.model('User', userSchema)
module.exports = User