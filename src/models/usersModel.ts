import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: [true, 'Email already exists'],
        },
        password: { type: String, required: true },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export interface IUser {
    _id?: string;
    username: string;
    email: string;
    password: string;
}

type UserModel = Exclude<IUser, '_id'> & mongoose.Document;
export const User: mongoose.Model<UserModel> = mongoose.model<UserModel>(
    'User',
    schema
);
