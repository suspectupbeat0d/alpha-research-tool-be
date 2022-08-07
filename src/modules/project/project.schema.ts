import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { EProjectType } from 'src/enums/project.enums';

export interface IProjectDocument extends Document {
  image: string;
  name: string;
  title: string;
  bio: string;
  ebCount: number;
  notableFollowers: string;
  notableFollowersCount: number;
  changes: Object;
  previousStats: Object;
  followers: number;
  tweets: number;
  createdDate: string;
  foundDate: string;
  foundAt: string;
  ebs: string;
  ebScore: number;
  _ebScore: number;
  status: string;
  lastScrapped: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProjectDocument>(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
      unique: true
    },
    title: {
      type: String,
    },
    bio: {
      type: String,
    },
    ebCount: { type: Number, default: 0 },
    notableFollowers: {
      type: String,
    },
    notableFollowersCount: { type: Number, default: 0 },
    changes: {
      type: Object,
    },
    previousStats: {
      type: Object,
    },
    followers: { type: Number, default: 0 },
    tweets: { type: Number, default: 0 },
    createdDate: { type: String },
    foundDate: { type: String },
    foundAt: { type: String },
    ebs: { type: String },
    ebScore: { type: Number, default: 0 },
    _ebScore: { type: Number, default: 0 },
    status: {
      type: String,
      default: EProjectType.ACTIVE,
    },
    lastScrapped: { type: Number, default: 0 },
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
