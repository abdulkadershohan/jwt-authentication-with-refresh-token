import { Request } from 'express';
// interface IUser = {
//     _id: string;
//     name: string;
//     email: string;
//     updatedAt?: string;
//     createdAt?: string;
//     __v?: number;
// }
type IUser = {
    _id: string;
    name: string;
    email: string;
    updatedAt?: string;
    createdAt?: string;
    __v?: number;
    iat?: number;
    exp?: number;
}
type AuthenticatedRequest = Request & {
    user?: IUser;
};

type JwtPayload = {
    _id: string;
    name: string;
    email: string;
};
export { AuthenticatedRequest, JwtPayload, IUser };
