import mongoose from "mongoose";
/*
Build schema
*/

const mySchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
    img: {
        type: String,
        required: true
    },
	postedBy: {
		type: String,
		required: true
	}
}, {
	timestamps: true // Adds createdAt, updatedAt fields
});

const Event = mongoose.model('event', mySchema);
/*
Export model for use in app
*/

export default Event;