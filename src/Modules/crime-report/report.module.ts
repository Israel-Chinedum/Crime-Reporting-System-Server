import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './crime-report-entities/report.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { AuthModule } from '../auth/auth.module';
import { Location } from './crime-report-entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Location]), AuthModule],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
