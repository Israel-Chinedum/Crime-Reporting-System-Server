import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { crimeReportDTO } from './crime-report-DTO/crime-report-dto';
import { saveReport } from './crime-report-utils/save-report.util';
import type { jwtPayload } from 'src/types/jwt-payload';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { saveEvidence } from './crime-report-utils/save-evidence.util';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    private readonly configService: ConfigService,
  ) {}

  // ====== SAVE REPORT METHOD ======
  async saveReport({
    body,
    user,
    file,
  }: {
    body: crimeReportDTO;
    user: jwtPayload;
    file: Express.Multer.File;
  }) {
    const { reportId } = await saveReport({
      report: body,
      reportRepo: this.reportRepo,
      user,
    });

    const supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    await saveEvidence({ file, supabase, reportId });

    return { message: 'Report saved!' };
  }

  // ====== GET REPORT METHOD ======
  async getReports({}) {}
}
