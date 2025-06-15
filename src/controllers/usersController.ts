import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/usersModel';
import { BaseController } from '.';

@Controller('users')
export class UsersController extends BaseController {
    @Post()
    public async create(req: Request, res: Response) {
        try {
            const user = new User(req.body);
            const newUser = await user.save();

            res.status(201).send(newUser);
        } catch (error: any) {
            this.sendCreateUpdateErrorResponse(res, error);
        }
    }
}
