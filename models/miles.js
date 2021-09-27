const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const addMilesSchema = new Schema({
  today_miles: {
    type: Number, 
  },
  day_ran: {
      type: Date,
  },
  shoe_ran_in: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Shoe' 
  }

})

addMilesSchema.virtual('id').get(function(){
  return this._id.toHexString()
}) 

addMilesSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v
      delete ret._id
  }
})

const Miles = mongoose.model('Miles', addMilesSchema)
module.exports = Miles;
