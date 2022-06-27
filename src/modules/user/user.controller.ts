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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto, validateEmailDto } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommonServices } from '../shared/services/common.service';
import { AuthService } from '../auth/auth.service';
import { VERIFIED_REPOSITORY } from 'src/constants';
import { IVerifiedUserDocument } from './verified.schema';
import { Model } from 'mongoose';

@Controller('user')
export class UserController extends CommonServices {
  constructor(
    @Inject(VERIFIED_REPOSITORY)
    readonly verifiedUserRepo: Model<IVerifiedUserDocument>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async twitterLoginRedirect(@Req() req, @Res() res: Response): Promise<any> {
    const response = await this.authService.login(req.user, req.user);

    return this.sendResponse(
      this.messages.Success,
      response,
      HttpStatus.OK,
      res,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/add')
  async addVerifiedUsers(
    @Req() req,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    const response = await this.verifiedUserRepo.find();
    (await response.length) === 0
      ? await this.verifiedUserRepo.create(body)
      : 
      body.users.map(async(item:any)=>{   
        await this.verifiedUserRepo.findByIdAndUpdate(response[0]._id, {
            $addToSet: { users: [item] },
          });
      })
    return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
  }
}
