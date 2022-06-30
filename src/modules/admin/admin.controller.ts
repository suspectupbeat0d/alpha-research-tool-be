import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController extends CommonServices {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @Req() req: any,
    @Res() res: Response,
    @Query() query,
  ): Promise<any> {
    try {

      if (!req.user.roles.includes('admin')) {
        return this.sendResponse(
          this.messages.onlyAdmin,
          {},
          HttpStatus.CONFLICT,
          res,
        );
      }
      const page = Number(query.page);
      const resPerPage = Number(query.resPerPage);
      const search = query.search;
      const users = await this.adminService.getAllUsers(
        page,
        resPerPage,
        search,
      );
      return this.sendResponse(
        this.messages.Success,
        users,
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
  async blockUser(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      if (!req.user.roles.includes('admin')) {
        return this.sendResponse(
          this.messages.onlyAdmin,
          {},
          HttpStatus.CONFLICT,
          res,
        );
      }
      const resp = await this.adminService.blockUser(req.params.id);
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

  @Get('un-block/:id')
  @UseGuards(JwtAuthGuard)
  async unBlock(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      if (!req.user.roles.includes('admin')) {
        return this.sendResponse(
          this.messages.onlyAdmin,
          {},
          HttpStatus.CONFLICT,
          res,
        );
      }
      const resp = await this.adminService.unBlockUser(req.params.id);
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
}
