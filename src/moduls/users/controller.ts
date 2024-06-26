import bcrypt from 'bcrypt';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, IUser, JwtPayload } from '../../type/interface';
import { User } from './model';
import { createToken } from '../../utils/token';
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
    const user = await User.findOne({ email })
    if (!user) {
        return next(createHttpError(400, 'Authentication failed'));
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return next(createHttpError(400, 'Authentication failed'));
    }
    try {

        // generate token
        const newUserData = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }

        const accessToken = createToken(newUserData, "ACCESS");
        const refreshToken = createToken(newUserData, "REFRESH");

        // set cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            path: "/",
        });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accessToken)

        // send response
        res.status(200).json({
            message: 'Authentication successful',
            user: {
                accessToken,
                refreshToken,
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
    const { email } = req.user as IUser
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
    res.clearCookie('accessToken').clearCookie('refreshToken');
    res.status(200).json({
        message: 'Logout successfully',
    });
}

export const generateRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.body.refreshToken;

    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
        return next(createHttpError.Unauthorized("Refresh token is required"));
    }

    if (!accessToken) {
        return next(createHttpError.Unauthorized("Access token is required"));
    }


    try {
        const user = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET_REFRESH_TOKEN!
        ) as JwtPayload;

        const findUser = await User.findOne({ email: user.email });

        if (!findUser) {
            throw createHttpError(404, 'User not found');
        }

        const newUserData = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
        }
        const newAccessToken = createToken(newUserData, "ACCESS");
        const newRefreshToken = createToken(newUserData, "REFRESH");

        // set cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            path: "/",
        });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accessToken)

        return res.status(201).json({
            message: "New access token generated",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        return next(error);
    }
};