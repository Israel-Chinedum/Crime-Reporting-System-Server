import { Repository } from 'typeorm';
import { Report } from '../crime-report-entities/report.entity';
import { crimeReportDTO } from '../crime-report-DTO/crime-report-dto';
import { BadRequestException } from '@nestjs/common';
import type { jwtPayload } from 'src/types/jwt-payload';
import { getLoacation } from './get-location.util';
import { Location } from '../crime-report-entities/location.entity';

export const saveReport = async ({
  report,
  reportRepo,
  user,
  reportId,
  locationRepo,
  fileMetaData,
}: {
  report: crimeReportDTO;
  reportRepo: Repository<Report>;
  user: jwtPayload;
  reportId: string;
  locationRepo: Repository<Location>;
  fileMetaData: any;
}) => {
  try {
    const { longitude, latitude, anonymous, ...filteredReport } = report;

    const { location } = await getLoacation({
      lat: latitude,
      lng: longitude,
      locationRepo,
    });

    const updatedReport = {
      reportId,
      actual_location: location,
      reported_by: !report.anonymous ? user.username : 'anonymous',
      status: 'active',
      fileMetaData,
      ...filteredReport,
    };

    // ====== Save user report to database and return reportId ======
    const userReport = reportRepo.create(updatedReport);
    await reportRepo.save(userReport);
    return { reportId };
  } catch (error) {
    console.log('ERROR: ', error);
    throw new BadRequestException('Unable to save user report!');
  }
};
