import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../crime-report/crime-report-entities/report.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), JwtModule],
  providers: [ChatGateway],
})
export class ChatModule {}
