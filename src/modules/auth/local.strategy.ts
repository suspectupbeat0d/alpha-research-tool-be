import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'identifier'});
  }

  async validate(identifier: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identifier);
    if (!user) {
      throw new UnauthorizedException(
        "Incorrect username or password"
      );
    }
    return user;
  }
}