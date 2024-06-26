// import { ErrorRequestHandler, RequestHandler } from "express";
import { ErrorRequestHandler } from "express";
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
};
export default errorHandler;