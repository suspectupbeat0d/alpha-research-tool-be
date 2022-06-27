import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  metamaskId: string;
  provider: string;
  followers: string;
  following: string;
  isActive: boolean;
  roles: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    password: { type: String, select: false },
    avatar: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metamaskId: {
      type: String,
    },
    provider: {
      type: String,
    },
    followers: {
      type: String,
    },
    following: {
      type: String,
    },
    roles: [
      {
        type: String,
        required: true,
      },
    ],
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { UserSchema };
