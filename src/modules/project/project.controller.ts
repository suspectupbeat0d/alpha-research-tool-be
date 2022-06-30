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
}
