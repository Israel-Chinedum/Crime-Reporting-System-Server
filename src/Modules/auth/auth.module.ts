import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './authGuard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), JwtModule, ConfigModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
