import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './crime-report-entities/report.entity';
import { Repository } from 'typeorm';
import { crimeReportDTO } from './crime-report-DTO/crime-report-dto';
import { saveReport } from './crime-report-utils/save-report.util';
import type { jwtPayload } from 'src/types/jwt-payload';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { saveEvidence } from './crime-report-utils/save-evidence.util';
import { generateReportId } from 'src/Utilities/generate-report-id';
import { Location } from './crime-report-entities/location.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
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
    // ====== Get report id ======
    let reportCount: number = await this.reportRepo.count();
    const reportId = generateReportId(reportCount);

    // ====== Make sure evidence provided is initially set to false ======
    body.evidence_provided = false;

    if (file) {
      const supabase = createClient(
        this.configService.get<string>('SUPABASE_URL')!,
        this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      await saveEvidence({ file, supabase, reportId });
      body.evidence_provided = true;
    }

    await saveReport({
      report: body,
      reportRepo: this.reportRepo,
      locationRepo: this.locationRepo,
      user,
      reportId,
    });

    return { message: 'Report saved!' };
  }

  // ====== GET REPORT METHOD ======
  async getReports({}) {}
}
