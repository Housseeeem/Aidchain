const mongoose = require("mongoose")
require("./collections/index")

const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/aidchain"; // Replace with your MongoDB local URL

const getConnection = async () => {
	if (mongoose.connection.readyState === 1) {
		console.log("MongoDB is already connected.");
		return mongoose.connection;
	}

	const connection = await mongoose.connect(mongoURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	if (!connection)
		return console.error("Error during MongoDB connection initialization:", error);

	console.log("MongoDB connection established successfully.");

	return connection;
};



module.exports = { getConnection };
