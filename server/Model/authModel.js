const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name : {type: String},
    email : {type : String},
    password : {type : String},
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
})

const userModel = mongoose.model('user',schema)

module.exports = userModel;