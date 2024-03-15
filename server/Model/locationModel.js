const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },    
  name: { type: String, required: true },
  weatherData: [{ date: Date, temperature: Number, condition: String }]
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
