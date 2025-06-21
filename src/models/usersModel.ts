import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import AuthService from '@src/services/auth';

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

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'duplicated',
}

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

schema.path('email').validate(async (email: string): Promise<boolean> => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
}, 'Email already exists', CUSTOM_VALIDATION.DUPLICATED);

schema.pre<UserModel>('save', async function (): Promise<void> {
    if (!this.password || !this.isModified('password')) {
        return;
    }

    try {
        const hashedPassword = await AuthService.encryptPassword(this.password);
        this.password = hashedPassword;

    } catch (error) {
        console.error('Error encrypting password:', error);
    }
})

