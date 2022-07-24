import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PROJECT_REPOSITORY } from 'src/constants';
import { EProjectType } from 'src/enums/project.enums';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IProjectDocument } from './project.schema';

@Injectable()
export class ProjectService extends sharedCrudService {
  constructor(
    @Inject(PROJECT_REPOSITORY) readonly projectRepo: Model<IProjectDocument>,
  ) {
    super(projectRepo);
  }

  async getAllProjects(
    page: number,
    resPerPage: number,
    search: string,
    NFSearch: string,
    minEbcount: number,
    maxEbcount: number,
    minFollowers: number,
    maxFollowers: number,
    minInfluencers: number,
    maxInfluencers: number,
    minTweets: number,
    maxTweets: number,
    min24Change: any,
    max24Change: any,
    min24ChangeP: any,
    max24ChangeP: any,
    min7Change: any,
    max7Change: any,
    min7ChangeP: any,
    max7ChangeP: any,
  ) {
    const query = [];
    const sorting = [];
    let sort = {};
    // console.log("API CALL")
    sort['createdAt'] = -1;
    sorting.push({ createdAt: -1 });
    query.push({ status: EProjectType.ACTIVE });

    if (minEbcount > 0) query.push({ ebCount: { $gte: minEbcount } });
    if (maxEbcount > 0) query.push({ ebCount: { $lte: maxEbcount } });
    if (minEbcount > 0 && maxEbcount > 0)
    
      query.push({
        $and: [
          { ebCount: { $gte: minEbcount } },
          { ebCount: { $lte: maxEbcount } },
        ],
      });

    if (minFollowers > 0) query.push({ followers: { $gte: minFollowers } });
    if (maxFollowers > 0) query.push({ followers: { $lte: maxFollowers } });
    if (minFollowers > 0 && maxFollowers > 0)
      query.push({
        $and: [
          { followers: { $gte: minFollowers } },
          { followers: { $lte: maxFollowers } },
        ],
      });

    if (minInfluencers > 0)
      query.push({ notableFollowersCount: { $gte: minInfluencers } });
    if (maxInfluencers > 0)
      query.push({ notableFollowersCount: { $lte: maxInfluencers } });
    if (minInfluencers > 0 && maxInfluencers > 0)
      query.push({
        $and: [
          { notableFollowersCount: { $gte: minInfluencers } },
          { notableFollowersCount: { $lte: maxInfluencers } },
        ],
      });

    if (minTweets > 0) query.push({ tweets: { $gte: minTweets } });
    if (maxTweets > 0) query.push({ tweets: { $lte: maxTweets } });
    if (minTweets > 0 && maxTweets > 0)
      query.push({
        $and: [
          { tweets: { $gte: minTweets } },
          { tweets: { $lte: maxTweets } },
        ],
      });

    /**
     * 24h count and % filter
     */
    if (parseInt(min24Change, 10) > 0)
      query.push({ 'changes._24h.count': { $gte: parseInt(min24Change, 10) } });
    if (parseInt(max24Change, 10) > 0)
      query.push({ 'changes._24h.count': { $lte: parseInt(max24Change, 10) } });
    if (parseInt(min24Change, 10) > 0 && parseInt(max24Change, 10) > 0)
      query.push({
        $and: [
          { 'changes._24h.count': { $gte: parseInt(min24Change, 10) } },
          { 'changes._24h.count': { $lte: parseInt(max24Change, 10) } },
        ],
      });

    if (parseInt(min24ChangeP, 10) > 0)
      query.push({
        'changes._24h.percent': { $gte: parseInt(min24ChangeP, 10) },
      });
    if (parseInt(max24ChangeP, 10) > 0)
      query.push({
        'changes._24h.percent': { $lte: parseInt(max24ChangeP, 10) },
      });
    if (parseInt(min24ChangeP, 10) > 0 && parseInt(max24ChangeP, 10) > 0)
      query.push({
        $and: [
          { 'changes._24h.percent': { $gte: parseInt(min24ChangeP, 10) } },
          { 'changes._24h.percent': { $lte: parseInt(max24ChangeP, 10) } },
        ],
      });

    /**
     * 7 days count and % filter
     */
    if (parseInt(min7Change, 10) > 0)
      query.push({ 'changes._7d.count': { $gte: parseInt(min7Change, 10) } });
    if (parseInt(max7Change, 10) > 0)
      query.push({ 'changes._7d.count': { $lte: parseInt(max7Change, 10) } });
    if (parseInt(min7Change, 10) > 0 && parseInt(max7Change, 10) > 0)
      query.push({
        $and: [
          { 'changes._7d.count': { $gte: parseInt(min7Change, 10) } },
          { 'changes._7d.count': { $lte: parseInt(max7Change, 10) } },
        ],
      });

    if (parseInt(min7ChangeP, 10) > 0)
      query.push({
        'changes._7d.percent': { $gte: parseInt(min7ChangeP, 10) },
      });
    if (parseInt(max7ChangeP, 10) > 0)
      query.push({
        'changes._7d.percent': { $lte: parseInt(max7ChangeP, 10) },
      });
    if (parseInt(min7ChangeP, 10) > 0 && parseInt(max7ChangeP, 10) > 0)
      query.push({
        $and: [
          { 'changes._7d.percent': { $gte: parseInt(min7ChangeP, 10) } },
          { 'changes._7d.percent': { $lte: parseInt(max7ChangeP, 10) } },
        ],
      });

    if (search)
      query.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
        ],
      });
    if (NFSearch)
      query.push({ notableFollowers: { $regex: NFSearch, $options: 'i' } });

    const [projects, projectsCount]: any = await Promise.all([
      this.projectRepo
        .find({ $and: [...query] })
        .sort(sort)
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage),
      this.projectRepo.find({ $and: [...query] }).count(),
    ]);

    const projectsResp = {
      projects: projects,
      current_page: page,
      pages: Math.ceil(projectsCount / resPerPage),
      total_projects: projectsCount,
      per_page: resPerPage,
    };

    return projectsResp;
  }
}
