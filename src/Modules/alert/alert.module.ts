import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alert]), AuthModule],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
