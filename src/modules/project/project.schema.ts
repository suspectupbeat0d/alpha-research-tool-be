import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { EProjectType } from 'src/enums/project.enums';

export interface IProjectDocument extends Document {
  image: string;
  title: string;
  bio: string;
  ebCount: number;
  notableFollowers: string;
  notableFollowersCount: number;
  changes: Object;
  previousStats: Object;
  followers: number;
  tweets: number;
  creationDate: string;
  foundDate: string;
  foundAt: string;
  ebs: string;
  ebScore: number;
  status: string;
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
      type: Number,
    },
    changes: {
      type: Object,
    },
    previousStats: {
      type: Object,
    },
    followers: {
      type: Number,
    },
    tweets: {
      type: Number,
    },
    creationDate: { type: String },
    foundDate: { type: String },
    foundAt: { type: String },
    ebs: { type: String },
    ebScore: { type: Number },
    status: {
      type: String,
      default: EProjectType.ACTIVE,
    },
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
