import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
    protected sendCreateUpdateErrorResponse(
        res: Response,
        error: mongoose.Error.ValidationError | Error
    ): void {
        if (error instanceof mongoose.Error.ValidationError) {
            const clientError = this.handleClientError(error);
            res.status(clientError.code).send(clientError);
        } else {
            res.status(500).send({ code: 500, error: 'something went wrong' });
        }
    }

    private handleClientError(error: mongoose.Error.ValidationError): { code: number, error: string } {
        const errorKind = error.errors[Object.keys(error.errors)[0]].kind;

        switch (errorKind) {
            case 'duplicated':
                return { code: 409, error: error.message };
            default:
                return { code: 422, error: error.message };
        }

    }
}
