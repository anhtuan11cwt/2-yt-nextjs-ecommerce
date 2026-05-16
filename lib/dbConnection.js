import mongoose from "mongoose";

// Lấy URI kết nối MongoDB từ env
function getMongoUri() {
	const mongodbUri = process.env.MONGODB_URI;

	if (!mongodbUri) {
		throw new Error(
			"Vui lòng định nghĩa biến MONGODB_URI trong file .env.local",
		);
	}

	return mongodbUri;
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

// Kết nối MongoDB với caching
async function connectDB() {
	const mongodbUri = getMongoUri();

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(mongodbUri, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectDB;
