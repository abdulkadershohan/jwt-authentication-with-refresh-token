import { NextFunction, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../moduls/users/model';
import { AuthenticatedRequest } from '../type/interface';

export const authGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) return next(createError.Unauthorized("Access denied"));
    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;
        const { email, userId } = decoded;
        const user = await User.findOne({ email, _id: new mongoose.Types.ObjectId(userId) });
        if (!user) {
            return next("Authentication failure!");
        }
        // set user in request object
        req.user = user;
        next();
    }
    catch (err) {
        // console.log(err);
        next(
            createError.Unauthorized(`Access denied, invalid token`)
        );
    }
};