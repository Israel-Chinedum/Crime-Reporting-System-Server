import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReportService } from './report.service';
import { crimeReportDTO } from './crime-report-DTO/crime-report-dto';
import type { Request } from 'express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async saveReport(@Body() body: crimeReportDTO, @Req() req: Request) {
    if (req.user) {
      return await this.reportService.saveReport({ body, user: req.user });
    }
  }
}
