
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        console.log( user, err, info )
        // You can throw an exception based on either "info" or "err" arguments
        
        if (user.active === false) {
          throw err || new UnauthorizedException();
        }
        // console.log(user, info, '##################JWT');
        if (err || !user) {
          throw err || new UnauthorizedException();
        }
        return user;
      }
}
