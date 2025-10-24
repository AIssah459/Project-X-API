import User from "../config/models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path: '../../.env'});

const authController = {
    signupPost : async (req, res) => {
        console.log('\n[SIGNUP] Received signup request');
        const creds = req.body;

        const user = creds.username;
        const pwd = creds.password;
        const email = creds.email;

        if (!user || !pwd) {
            return res.status(200).json({success: false, 'message': 'Username and password are required'});
        }

        if(!email) {
            return res.status(200).json({success: false, 'message': 'Email is required'});
        }

        console.log(creds);

        if(await User.findOne({username: user})) {
            return res.status(200).json({success: false, 'message': 'Username already exists'});
        }
        else if(await User.findOne({email: email})) {
            return res.status(200).json({success: false, 'message': 'Email already registered'});
        }
        
        if(pwd.length < 6) {
            return res.status(200).json({success: false, 'message': 'Password must be at least 6 characters long'});
        }

        /*
        Create new user record
        */

        const newUser = new User({username: user, password: pwd, email: email});

        /*
        Save user record to database
        */
        
        try{
            await newUser.save();
            console.log('\tCreated new user: ' + user);
            return res.status(200).json({success: true, message: 'Successfully created account!'})
        }
        catch {
            return res.status(500).json({success: false, message: 'Internal server error'})
        }
    },

    loginPost : async (req, res) => {
        console.log('\n[LOGIN] Received login request');
        const creds = req.body;

        const username = creds.username;
        const pwd = creds.password;

        if (!username || !pwd) {
            return res.status(200).json({'message': 'Username and password are required'});
        }

        console.log(`\tAttempting to find user ${creds.username} in DB`);

        const foundUser = await User.findOne({username: username, password: pwd});
        if(!foundUser) {
            return res.status(401).json({'message': 'User not found'});
        }
        
        const matchPwd = await User.findOne({username: username, password: pwd});
        if(matchPwd) {
            const accessToken = jwt.sign(
                {'username': foundUser.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}
            );

            //Assign auth tokens
            const refreshToken = jwt.sign(
                {'username': foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '7d'}
            );
            console.log('\tGenerated tokens');
            console.log(process.env.NODE_ENV);
            const isProduction = process.env.NODE_ENV === 'production';
            console.log(`Is this production? ${isProduction}`);

            const cookieOptions = {
                httpOnly: true,
                maxAge: 7*24*60*60*1000,
                path: '/',
                sameSite: isProduction ? 'none' : 'Lax',
                secure: isProduction 
            }

            console.log(cookieOptions);
            
            await res.cookie('jwt', refreshToken, {cookieOptions});
            console.log('\tSent refresh token cookie');
            return res.status(200).json({success: true, 'message': 'Login successful!', 'accessToken': accessToken, uid: foundUser._id});
        }
        else {
            return res.status(401).json({success: false, 'message': 'Incorrect password'});
        }
    },

    logoutPost: async (req, res) => {
        console.log('\n[LOGOUT] Received logout request');

        const refreshToken = jwt.sign(
                {'username': req.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '7d'}
            );
        const isProduction = process.env.NODE_ENV === 'production';
        await res.cookie('jwt', refreshToken, {
                                                        httpOnly: true,
                                                        maxAge: 1,
                                                        path: '/',
                                                        sameSite: isProduction ? 'none' : 'Lax',
                                                        secure: isProduction                                                    });
        console.log('\tSuccessfully logged out');
        return res.status(200).json({success: true, 'message': 'Logout successful!'});
    },

    refreshPost : async (req, res) => {
        console.log('\n[REFRESH] Received token refresh request');
        const cookies = req.cookies;

        if(!cookies?.jwt) {
            console.log('\tNo refresh token cookie found');
            return res.status(403).json({message: 'Unauthorized'});
        }

        const refreshToken = cookies.jwt;
        console.log('\tVerifying refresh token');

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if(err){
                    console.log('\tRefresh token verification failed');
                    return res.status(403).json({message: 'Forbidden'});
                }
                console.log('\tGenerating new access token for user ' + decoded.username);
                const accessToken = jwt.sign(
                    {'username': decoded.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '1h'}
                );
                const user = await User.findOne({username: decoded.username});
                const uid = user.id;
                return res.status(200).json({authenticated: true, message: 'Token refreshed', data: {accessToken: accessToken, uid: uid}});
            }
        );
    },
    
    checkAuthPost : async (req, res) => {

        const cookies = req.cookies;
        if(!cookies?.jwt) {
            console.log('\tNo refresh token cookie found');
            return res.status(401).json({message: 'Unauthorized'});
        }

        console.log('\n[CHECK AUTH] Received authentication check request');
        console.log('\tChecking authentication status');
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if(!accessToken) {
            console.log('\tNo access token found in request headers');
            return res.status(401).json({message: 'Unauthorized'});
        }
        console.log(accessToken);
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if(err){
                    console.log('\tAccess token verification failed');
                    return res.status(401).json({message: 'Unauthorized'});
                }
                console.log('\tUser ' + decoded.username + ' is authenticated' );
                return res.status(200).json({authenticated: true, accessToken: accessToken, user: decoded.username});
            }
        );
    },
};

export default authController;