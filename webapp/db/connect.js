var Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;

Mongoose.connect('mongodb://storage:27017/host');

var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
	console.log("Connection with MongoDB --- database succeeded.");
});

exports.Mongoose = Mongoose;
exports.db = db;
