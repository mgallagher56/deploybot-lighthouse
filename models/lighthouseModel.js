const mongoose = require('mongoose');
const {Schema} = mongoose;

const lighthouseSchema = new Schema({
    name: String,
    description: String,
})

mongoose.model('lighthouse', lighthouseSchema);