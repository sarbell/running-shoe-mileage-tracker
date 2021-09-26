const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const shoeSchema = new Schema({
  first_date: {
    type: Date, 
    required: true, 
  },
  brand: {
    type: String, 
    required: true, 
  },
  model: {
    type: String, 
    required: true, 
  },
  size: {
    type: String, 
  },
  type: {
    type: String, 
    enum: ['road', 'trail', 'racing'],
    defualt: 'road',
    required : true 
  },
  nickname: {
    type: String, 
  },
  status: {
    type: Boolean, 
    required: true,
  },
  notes: {
    type: String, 
  },
  miles: {
    type: Number, 
  },
  updated_at: {
      type: Date,
  },
  added_at: {
    type: Date,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

})

shoeSchema.virtual('id').get(function(){
  return this._id.toHexString()
}) 

shoeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
  }
})

const Shoe = mongoose.model('Shoe', shoeSchema)
module.exports = Shoe;
