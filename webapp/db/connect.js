var Mongoose = require('mongoose');

Mongoose.connect('mongodb://storage:27017/host');

var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
	console.log("Connection with database succeeded.");
});

exports.Mongoose = Mongoose;
exports.db = db;
