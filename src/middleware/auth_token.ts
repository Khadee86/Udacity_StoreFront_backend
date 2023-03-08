import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader: string = req.headers.authorization as string;
        console.log(authorizationHeader);
        const token = authorizationHeader && authorizationHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
        // res.json(token);
        // console.log(token);
        next();
    } catch (error) {
        res.status(401).json(`Error! Unable to verify token: ${error}`);
        return;
    }
};

export default verifyAuthToken;
