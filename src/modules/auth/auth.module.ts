import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { TwitterStrategy } from './twitter.strategy';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  controllers: [ AuthController ],
  providers: [AuthService, UserService, JwtStrategy, TwitterStrategy],
  exports: [AuthService],
})
export class AuthModule {}