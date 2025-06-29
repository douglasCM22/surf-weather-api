import mongoose, { Model } from 'mongoose';

const schema = new mongoose.Schema(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        name: { type: String, required: true },
        position: { type: String, required: true },
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

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N',
}

export interface IBeach {
    _id?: string;
    lat: number;
    lng: number;
    name: string;
    position: BeachPosition;
}

type BeachModel = Exclude<IBeach, '_id'> & mongoose.Document;

export const Beach: Model<BeachModel> = mongoose.model<BeachModel>(
    'Beach',
    schema
);
