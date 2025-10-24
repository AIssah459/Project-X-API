import mongoose from 'mongoose';

/*
Export function to connect to DB
*/

const connectDB = async () => {
	try {
		const options = {
			dbName: 'project-x',
		};
		await mongoose.connect(process?.env.MONGO_URI, options);
		console.log('MongoDB: Connected to Project X database');
	}
	catch {
		console.log('MongoDB: Could not connect to database');
	}
}

export default connectDB;