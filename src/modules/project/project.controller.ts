import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommonServices } from '../shared/services/common.service';
import { AuthService } from '../auth/auth.service';
import { Model } from 'mongoose';
import { ProjectService } from './project.service';
import { EProjectType } from 'src/enums/project.enums';

@Controller('project')
export class ProjectController extends CommonServices {
  constructor(
    private readonly projectService: ProjectService, // @Inject(VERIFIED_REPOSITORY) // readonly verifiedUserRepo: Model<IVerifiedUserDocument>,
  ) {
    super();
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/add')
  async addProject(
    @Req() req,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    try {
      if (body.name) {
        const projectResp = await this.projectService.sharedFindOne({
          name: body.name,
        });
        if (projectResp)
          return this.sendResponse(
            this.messages.projectAlreadyExist,
            {},
            HttpStatus.CONFLICT,
            res,
          );
      }
      const project = await this.projectService.sharedCreate(body);
      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
    } catch (error) {
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Put('/update/:id')
  async updateProject(
    @Req() req,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    try {
      if (body.name) {
        const projectResp = await this.projectService.sharedFindOne({
          name: body.name,
        });
        if (projectResp)
          return this.sendResponse(
            this.messages.projectAlreadyExist,
            {},
            HttpStatus.CONFLICT,
            res,
          );
      }
      const project = await this.projectService.sharedFindByIdAndUpdate(
        req.params.id,
        body,
      );
      return this.sendResponse(
        this.messages.updated,
        project,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('all')
  async getAllProjects(
    @Req() req: any,
    @Res() res: Response,
    @Query() query,
  ): Promise<any> {
    try {
      console.log("QUERY =>",query);
      
      const page = Number(query.page);
      const resPerPage = Number(query.resPerPage);
      const search = query.search;
      const NFSearch = query.NFSearch;
      const minEbcount = query.minEbcount;
      const maxEbcount = query.maxEbcount;
      const minFollowers = query.minFollowers;
      const maxFollowers = query.maxFollowers;
      const minTweets = query.minTweets;
      const maxTweets = query.maxTweets;
      const minInfluencers = query.minInfluencers;
      const maxInfluencers = query.maxInfluencers;
      const min24Change = query.min24Change;
      const max24Change = query.max24Change;
      const min7Change = query.min7Change;
      const max7Change = query.max7Change;
      const min24ChangeP = query.min24ChangeP;
      const max24ChangeP = query.max24ChangeP;
      const min7ChangeP = query.min7ChangeP;
      const max7ChangeP = query.max7ChangeP;
      const sortBy = query.sortBy;
      const sortType = query.sortType;

      const projects = await this.projectService.getAllProjects(
        page,
        resPerPage,
        search,
        NFSearch,
        minEbcount,
        maxEbcount,
        minFollowers,
        maxFollowers,
        minInfluencers,
        maxInfluencers,
        minTweets,
        maxTweets,
        min24Change,
        max24Change,
        min24ChangeP,
        max24ChangeP,
        min7Change,
        max7Change,
        min7ChangeP,
        max7ChangeP,
        sortBy,
        sortType,
      );
      return this.sendResponse(
        this.messages.Success,
        projects,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('details/:id')
  async getProjectDetail(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      const project = await this.projectService.sharedFindOne({
        _id: req.params.id,
      });
      return this.sendResponse(
        this.messages.Success,
        project,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('search/:name')
  async getProjectByName(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      const project = await this.projectService.sharedFindOne({
        name: req.params.name,
        status: EProjectType.ACTIVE,
        // name: { $regex: req.params.name, $options: 'i' },
      });
      return this.sendResponse(
        this.messages.Success,
        project,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('block/:id')
  @UseGuards(JwtAuthGuard)
  async blockProject(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      if (!req.user.roles.includes('admin')) {
        return this.sendResponse(
          this.messages.onlyAdmin,
          {},
          HttpStatus.CONFLICT,
          res,
        );
      }
      const resp = await this.projectService.projectRepo.findByIdAndUpdate(
        req.params.id,
        { status: EProjectType.BLOCKED },
      );

      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('block-personal/:id')
  async deleteProject(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      const resp = await this.projectService.projectRepo.findByIdAndUpdate(
        req.params.id,
        { status: EProjectType.BLOCKED },
      );

      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('/:timestamp')
  async getLastScrapped(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      const timestampConvert = parseInt(req.params.timestamp);
      const project = await this.projectService.projectRepo.aggregate([
        {
          $match: {
            lastScrapped: {
              $lt: timestampConvert,
            },
            status: EProjectType.ACTIVE,
          },
        },
        { $sample: { size: 1 } },
      ]);

      // const project = await this.projectService.sharedFind({
      //   lastScrapped: {
      //     $lt: timestampConvert,
      //   },
      //   status: EProjectType.ACTIVE,
      // });

      return this.sendResponse(
        this.messages.Success,
        project,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
}
