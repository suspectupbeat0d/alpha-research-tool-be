import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IVerifiedUserDocument extends Document {
  users: Array<string>;
  createdAt: Date;
}

const VerifiedUserSchema = new mongoose.Schema<IVerifiedUserDocument>(
  {
    users: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);

VerifiedUserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { VerifiedUserSchema };
