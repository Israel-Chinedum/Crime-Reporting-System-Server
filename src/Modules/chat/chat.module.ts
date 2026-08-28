import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../crime-report/crime-report-entities/report.entity';
import { ChatGateway } from './chat.gateway';
import { SecurityTip } from 'src/Entities/saveTip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, SecurityTip]), JwtModule],
  providers: [ChatGateway],
})
export class ChatModule {}
