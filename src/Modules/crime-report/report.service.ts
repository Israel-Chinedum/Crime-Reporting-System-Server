import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { verifyTimeFormat } from 'src/Utilities/verify-time-format.util';
import { getSecurityLocation } from './crime-report-utils/get-security-location.util';
import { getLoacation } from './crime-report-utils/get-location.util';

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
    // ====== Convert time value to uppercase ======
    body.time = body.time.toUpperCase();
    console.log(body.time);

    const timeFormat = verifyTimeFormat.isTimeFormat(body.time);
    if (!timeFormat) {
      throw new BadRequestException('Time value is improper!');
    }

    console.log('Testing');
    // ====== Get report id ======
    let reportCount: number = await this.reportRepo.count();
    const reportId = generateReportId(reportCount);
    let fileMetaData: any = null;

    // ====== Make sure evidence provided is initially set to false ======
    body.evidence_provided = false;

    if (file) {
      const supabase = createClient(
        this.configService.get<string>('SUPABASE_URL')!,
        this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      await saveEvidence({ file, supabase, reportId });
      fileMetaData = { name: file.originalname, mimetype: file.mimetype };
      body.evidence_provided = true;
    }

    await saveReport({
      report: body,
      reportRepo: this.reportRepo,
      locationRepo: this.locationRepo,
      user,
      reportId,
      fileMetaData,
    });

    return { message: reportId };
  }

  // ====== GET REPORT METHOD ======
  async getUserReports({ user }: { user: jwtPayload }) {
    try {
      const userReports = await this.reportRepo.find({
        where: { reported_by: user.username },
      });
      return userReports;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Unable to get user reports!');
    }
  }

  // ====== GET USER LOCATION METHOD ======
  async getUserLocation(payload: { lat: string; lng: string }) {
    try {
      const { location } = await getLoacation({
        lat: payload.lat,
        lng: payload.lng,
        locationRepo: this.locationRepo,
      });
      return location;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occured please try again later!',
      );
    }
  }

  // ====== GET SECURITY LOCATION METHOD ======
  async getSecurityLocations(payload: { lat: string; lng: string }) {
    try {
      const security_locations = await getSecurityLocation({
        locationRepo: this.locationRepo,
        lat: payload.lat,
        lng: payload.lng,
      });

      const { location } = await getLoacation({
        lat: payload.lat,
        lng: payload.lng,
        locationRepo: this.locationRepo,
      });

      return { user_location: location, security_locations };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occured please try again later!',
      );
    }
  }
}
