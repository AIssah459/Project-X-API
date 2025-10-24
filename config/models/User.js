import mongoose from "mongoose";
/*
Build schema
*/

const mySchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
    password: {
        type: String,
        required: true
    }
}, {
	timestamps: true // Adds createdAt, updatedAt fields
});

const User = mongoose.model('user', mySchema);
/*
Export model for use in app
*/

export default User;