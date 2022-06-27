import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { CommonServices } from '../shared/services/common.service';
import { UserService } from '../user/user.service';
import { jwtConstants } from 'src/constants';

@Injectable()
export class AuthService extends CommonServices {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {
    super()
  }
  async validateUser(identifier: string): Promise<any> {
    const user = await this.userService.userRepository.findOne({email: identifier})
    if (user) {
      return user;
    }
    return null;
  }
  
  
  async validateAdmin(email: string, pass: string): Promise<any> {
    const user = await this.userService.userRepository
      .findOne({
        email: email
      })
      .select("+password");
    // console.log(user, "in auth", pass, user.password);
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return HttpStatus.UNAUTHORIZED;
  }

  async login(user: any, body: any = {}) {
    const payload = {
      userId: user._id ? user._id : user.userId,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      // metamaskId: user.metamaskId,
      roles: user.roles,
      active: user.isActive ? user.isActive : user.active
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '60d', secret: jwtConstants.secret }),
      user: {
        _id: user._id ? user._id : user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        active: user.isActive ? user.isActive : user.active,
        roles: user.roles,
        // cover: user.cover,
        // createdAt: user.createdAt,
        // metamaskId: user.metamaskId,
        // updatedAt: user.updatedAt,
      },
    };
  }

  async verifyEmail(email: any) {
    let user = await this.userService.userRepository.findOne({ email: email })
    if (user && user._id) {
      return true
    } else {
      return false
    }
  }

}