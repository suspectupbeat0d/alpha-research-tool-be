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

@Controller('project')
export class ProjectController extends CommonServices {
  constructor(
    private readonly projectService: ProjectService,
    // @Inject(VERIFIED_REPOSITORY)
    // readonly verifiedUserRepo: Model<IVerifiedUserDocument>,
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
      const project = await this.projectService.sharedCreate(body)
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
      const project = await this.projectService.sharedFindByIdAndUpdate(req.params.id, body)
      return this.sendResponse(this.messages.updated, project, HttpStatus.OK, res);
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
      const page = Number(query.page);
      const resPerPage = Number(query.resPerPage);
      const search = query.search;
      const price = Number(query.price);

      const projects = await this.projectService.getAllProjects(
        page,
        resPerPage,
        search,
        price,
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
      const project = await this.projectService.sharedFindOne({_id: req.params.id})
      return this.sendResponse(this.messages.Success, project, HttpStatus.OK, res);
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
