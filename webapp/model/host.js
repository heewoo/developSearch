var Mongoose = require('../db/connect').Mongoose;

var userSchema = new Mongoose.Schema({
    host: {
        type: String,
        required: true
    },
    tableReginon:{
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});



module.exports = Mongoose.model('Host', userSchema, 'Host');
