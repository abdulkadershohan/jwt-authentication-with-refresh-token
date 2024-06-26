import bcrypt from 'bcrypt';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../type/interface';
import { User } from './model';
const router = express.Router();

// signup
export const signup: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return next(createHttpError(400, 'User already exist'));
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const cerateNewUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await cerateNewUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        console.log(err);
    }
};
// login 
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(createHttpError(400, 'Authentication failed'));
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return next(createHttpError(400, 'Authentication failed'));
    }
    try {
        // generate token
        const access_token = jwt.sign({
            email: user.email,
            userId: user._id,
        }, process.env.JWT_SECRET as any, {
            expiresIn: '1h',
        })
        // set cookie
        res.cookie('access_token', access_token, {
            httpOnly: true,
        });

        // send response
        res.status(200).json({
            message: 'Authentication successful',
            user: {
                access_token: access_token,
                name: user.name,
                email: user.email,
            }
        });
    }
    catch {
        res.status(401).json({
            "error": "Authetication failed!"
        });
    }
}
// user profile
export const profile = async (req: AuthenticatedRequest, res: Response) => {
    const { email } = req.user;
    try {
        const user = await User.findOne({ email }).
            select('-password').
            exec();
        if (!user) {
            return res.status(401).json({
                message: 'Access denied',
            });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });

    }
    catch (err) {
        res.status(401).json({
            message: 'Access denied',
        });
    }
}

// logout
export const logout = (req: Request, res: Response) => {
    // Clear the token from client-side by setting an expired token in response
    res.cookie('access_token', '', { expires: new Date(0) }).send();
    // res.cookie('access_token', '', {
    //     httpOnly: true,
    //     expires: new Date(0),
    // });
    // res.status(200).json({
    //     message: 'Logout successfully',
    // });
}