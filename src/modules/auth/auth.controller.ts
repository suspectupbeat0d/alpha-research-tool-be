import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CommonServices } from '../shared/services/common.service';
import { LoginDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { env } from 'process';
import { Model } from 'mongoose';
import { VERIFIED_REPOSITORY } from 'src/constants';
import { IVerifiedUserDocument } from '../user/verified.schema';

@Controller('auth')
export class AuthController extends CommonServices {
  constructor(
    @Inject(VERIFIED_REPOSITORY)
    readonly verifiedUserRepo: Model<IVerifiedUserDocument>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  @Post('/login')
  async login(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    try {
      // const user = body.email ? await this.authService.validateAdmin(body.email, body.password) : await this.authService.validateUser( body.metamaskId )
      // if(user === HttpStatus.UNAUTHORIZED) return this.sendResponse(this.messages.unAuthrized, {}, HttpStatus.UNAUTHORIZED, res);

      const user = await this.userService.sharedFindOne({ email: body.email });
      if (user?.isActive === false)
        return this.sendResponse(
          this.messages.blocked,
          {},
          HttpStatus.FORBIDDEN,
          res,
        );
      if (user) {
        const response = await this.authService.login(user, body);
        return this.sendResponse(
          this.messages.loggedIn,
          response,
          HttpStatus.OK,
          res,
        );
      } else {
        let { ...obj } = body;

        const createUser = await this.userService.sharedCreate({
          ...obj,
          roles: ['user'],
        });

        const response = await this.authService.login(createUser, body);
        return this.sendResponse(
          this.messages.accountCreated,
          response,
          HttpStatus.OK,
          res,
        );
      }
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

  @Get('/twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/twitter/redirect')
  @UseGuards(AuthGuard('twitter'))
  async twitterLoginRedirect(@Req() req, @Res() res: Response): Promise<any> {
    try {
      const usersList = await this.verifiedUserRepo.find();
      if (!usersList[0].users.includes(req.user.username)) {
        res.redirect(
          `${env.FRONTEND_URL}/NOT_EXIST`);
        return;
      }
      const user = await this.userService.sharedFindOne({
        email: req.user.email,
      });
      if (user?.isActive === false)
        return this.sendResponse(
          this.messages.blocked,
          {},
          HttpStatus.FORBIDDEN,
          res,
        );
      let userResp: any = {};
      if (user) {
        userResp = await this.authService.login(user, req.user);
      } else {
        let { ...obj } = req.user;
        const createUser = await this.userService.sharedCreate({
          ...obj,
          roles: ['user'],
        });
        userResp = await this.authService.login(createUser, req.user);
      }
      res.redirect(`${env.FRONTEND_URL}/${userResp.access_token}`);
    } catch (error) {
      console.log(error);
    }
  }
}
