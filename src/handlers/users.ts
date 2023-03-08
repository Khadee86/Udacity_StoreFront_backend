import express, { Request, Response } from 'express';
import { UserModel, User } from '../models/users';
import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middleware/auth_token';

const userModel = new UserModel();
// INDEX
const index = async (_req: Request, res: Response) => {
    try {
        const userList = await userModel.index();
        res.json(userList);
    } catch (err) {
        res.status(401).json(`Unable to Show List of Users. ${err}`);
    }
};

// CREATE
const create = async (req: Request, res: Response) => {
    const user: User = {
        email: req.body.email,
        pword: req.body.pword,
        fname: req.body.fname,
        lname: req.body.lname
    };
    try {
        const newUser = await userModel.create(user);
        var token = jwt.sign(
            { email: user.email, fname: user.fname, lname: user.lname },
            process.env.TOKEN_SECRET as string
        );
        res.json(token);
    } catch (err) {
        res.status(400).json(`Cannot create User. ${err}`);
    }
};

//AUTHENTICATE
const authenticate = async (req: Request, res: Response) => {
    const user: User = {
        email: req.body.email,
        pword: req.body.pword,
        fname: '',
        lname: ''
    };
    try {
        const u = await userModel.authenticate(user.email, user.pword);
        var token = jwt.sign(
            { email: user.email },
            process.env.TOKEN_SECRET as string
        );
        res.json(token);
    } catch (error) {
        res.status(401).json(`Unable to authenticate user. ${error}`);
    }
};

// DELETE
const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await userModel.delete(req.body.id);
        if (deleted == true) {
            res.status(200).json({
                status: `Deleted user with id: ${req.body.id}`
            });
        } else {
            res.status(400).json(`Could not find user to delete.`);
        }
    } catch (error) {
        res.status(400).json(`unable to delete User, ${error}`);
    }
};

// SHOW
const show = async (req: Request, res: Response) => {
    try {
        const users = await userModel.show(req.body.id);
        res.json(users);
    } catch (err) {
        res.status(401).json(
            `Unable to show details for this specific user. ${err}`
        );
    }
};

// UPDATE
const update = async (req: Request, res: Response) => {
    const user: User = {
        email: req.body.email,
        pword: req.body.pword,
        fname: req.body.fname,
        lname: req.body.lname
    };
    try {
        await userModel.updateUser(req.body.id, user);
        res.status(200).json({ status: `Successfully Updated User details.` });
    } catch (err) {
        res.status(401).json(`Unable to update users. ${err}`);
    }
};

//USER ROUTES
const userRoutes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.post('/users', verifyAuthToken, create);
    app.put('/users/:id', verifyAuthToken, update);
    app.delete('/users/:id', verifyAuthToken, destroy);
    app.post('/users/auth', authenticate);
};

export default userRoutes;
