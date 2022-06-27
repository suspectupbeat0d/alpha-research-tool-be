
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ DatabaseModule ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService],
  exports: [UserService]
})
export class UserModule {}