import { NextFunction, Response } from 'express';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../moduls/users/model';
import { AuthenticatedRequest, IUser } from '../type/interface';

export const authGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) return next(createError.Unauthorized("Access denied"));
    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET_AUTH_TOKEN as string) as any;
        const { email, userId } = decoded;
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return next(createError.Unauthorized("Authentication failure!"));
        }
        req.user = user.toObject() as IUser;
        next();
    } catch (err) {
        console.error(err);
        next(createError.Unauthorized(`Access denied, invalid token`));
    }
};