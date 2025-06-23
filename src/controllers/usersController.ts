import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/usersModel';
import { BaseController } from '.';
import AuthService from '@src/services/auth';

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

    @Post('authenticate')
    public async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        console.log(user);

        if (!user) {
            return res.status(401).send({
                code: 401,
                error: 'User not found!',
            });
        }
        if (!(await AuthService.comparePassword(req.body.password, user.password))) {
            return res
                .status(401)
                .send({ code: 401, error: 'Password does not match!' });
        }

        console.log('pass')

        const token = AuthService.generateToken(user.toJSON());

        return res.send({ ...user.toJSON(), ...{ token } });
    }
}
