var Mongoose = require('../db/connect').Mongoose;

var userSchema = new Mongoose.Schema({
    username: {
	type: String
    },
    firstname: {
	type: String
    },
    lastname: {
	type: String
    },
    email: {
	type: String,
	required: true
    },
    password: {
	type: String,
	required: true
    },
    created_at: {
	type: Date,
	required: true,
        default: Date.now
    }
});

userSchema.plugin(require('passport-local-mongoose'), {
    usernameField: 'email',
    hashField: 'password',
});

module.exports = Mongoose.model('User', userSchema, 'Users');
