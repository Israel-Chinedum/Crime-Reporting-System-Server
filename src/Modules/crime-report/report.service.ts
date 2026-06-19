import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { crimeReportDTO } from './crime-report-DTO/crime-report-dto';
import { saveReport } from './crime-report-utils/save-report.util';
import type { jwtPayload } from 'src/types/jwt-payload';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
  ) {}

  async saveReport({ body, user }: { body: crimeReportDTO; user: jwtPayload }) {
    return await saveReport({
      report: body,
      reportRepo: this.reportRepo,
      user,
    });
  }
}
