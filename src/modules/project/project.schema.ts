import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IProjectDocument extends Document {
  image: string;
  title: string;
  bio: string;
  ebCount: number;
  notableFollowers: string;
  notableFollowersCount: number;
  h24: number;
  d7: number;
  followers: string;
  tweets: number;
  creationDate: string;
  foundDate: string;
  foundAt: string;
  ebs: string;
  ebScore: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProjectDocument>(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    bio: {
      type: String,
    },
    ebCount: { type: Number },
    notableFollowers: {
      type: String,
    },
    notableFollowersCount: {
      type: Number
    },
    h24: {
      type: Number,
    },
    d7: {
      type: Number,
    },
    followers: {
      type: String,
    },
    tweets: {
      type: Number,
    },
    creationDate: {type: String},
    foundDate: {type: String},
    foundAt: {type: String},
    ebs: {type: String},
    ebScore: {type: Number},
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);

ProjectSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { ProjectSchema };
