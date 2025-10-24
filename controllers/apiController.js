import Event from "../config/models/Event.js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import fs from 'fs';

dotenv.config({path: '../../.env'});

const apiController = {
    getEvents: async (req, res) => {

        if(!req.cookies) {
            return null;
        }

        console.log('\n[EVENTS] Events requested');

        let events = [];

        console.log(req.query.postedBy);

        if(req.query.postedBy) {
            console.log('We got a posted by!');
            const username = req.query.postedBy.trim();
            events = await Event.find({postedBy: username});
        }
        else {
            console.log('No specified user');
            events = await Event.find({});
        }
        
        if (!events || (events.length < 1)) {
            return res.status(404).json({message: 'No events to display'});
        }
        const eventsJSON = [];
        events.forEach(event => {
            eventsJSON.push({
                id: event._id,
                title: event.title,
                img: event.img,
                postedBy: event.postedBy})
            console.log(`\tEvent ${event.title} by:\n\t${event.postedBy}`);
        });
        res.status(200).json(eventsJSON);
    },
    postEvents: async (req, res) => {
        if(!req.cookies) {
            return null;
        }

        console.log('\n[EVENTS] User attempting to post an event');
        
        const eventTitle = req.body.title;
        const postedBy = req.body.postedBy;

        if(await Event.findOne({title: req.body.title})) {
            
            return res.status(200).json({success: false, message: 'There is already an event with that title!'});
        }
        else {
            const filename = req.file.filename;
            const newEvent = new Event({title: eventTitle, img: filename, postedBy: postedBy});

            try{
                await newEvent.save();
                console.log('\tCreated new user: ' + eventTitle);
                return res.status(200).json({success: true, message: 'Successfully posted your event!'})
            }
            catch {
                return res.status(500).json({success: false, message: 'Internal server error'})
            }
        }
    },
    deleteEvents: async (req, res) => {
        const PROJECT_X_EVENT_ID = '68fa954d75a9855d364d959f';

       if(!req.cookies) {
            return null;
        }

        if(!req) {
            console.log("CORS...");
            return null;
        }

        console.log('\n[EVENTS] User attempting to delete an event');
        
        const eventID = req.params.id;

        const accessToken = req.headers['authorization']?.split(' ')[1];
        if(!accessToken) {
            console.log('\tNo access token found in request headers');
            return res.status(401).json({message: 'Unauthorized'});
        }

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if(err){
                    console.log('\tAccess token verification failed');
                    return res.status(401).json({message: 'Unauthorized'});
                }
                try {
                    console.log('\tEvent to be deleted: ' + eventID);
                    if(eventID == PROJECT_X_EVENT_ID) {
                        console.log('\tProject X will never die!');
                        return res.status(200).json({success: false, message: 'Can\'t delete that event!'})
                    }
                    const eventInfo = await Event.findById(eventID);
                    await Event.findByIdAndDelete(eventID);
                    const filePath = `../../public/images/${eventInfo.img}`; // Adjust the path to your file location
    
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('\tError deleting file:', err);
                        }
                        console.log('\tFile deleted successfully!');
                    });
                    res.status(200).json({success:true, message: 'Event deleted'});
                    console.log('\tEvent deleted');
                }
                catch {
                    res.status(404).json({success:false, message: 'Event not found'});
                    console.log('\tEvent not found');
                }
            }
        ); 
    },
    updateEvents: async (req, res) => {
        console.log('\n[EVENTS] User attempting to edit an event');
        const eventID = req.params.id;

        const foundEvent = await Event.findById(eventID);
        if(!foundEvent) {
            
            return res.status(404);
	    }

        const eventConfig = {
            title: req.body.title,
        }

        if(req.body.file) {
            eventConfig.img = req.body.file;
        }

        try {
            await Event.findByIdAndUpdate(eventID, eventConfig, {new:true});
            console.log("Event successfully updated");
            return res.status(200).json({ success: true });
        }
        catch {
            console.log('Internal server error'); 
            return res.status(500).json({ success: false, message: 'Failed to update event'}); 
        };
    }
}

export default apiController;