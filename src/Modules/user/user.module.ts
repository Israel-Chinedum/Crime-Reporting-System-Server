import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../Cache/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
