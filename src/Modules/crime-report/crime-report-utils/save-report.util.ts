import { Repository } from 'typeorm';
import { Report } from '../report.entity';
import { crimeReportDTO } from '../crime-report-DTO/crime-report-dto';
import { BadRequestException } from '@nestjs/common';
import type { jwtPayload } from 'src/types/jwt-payload';
import { verifyTimeFormat } from 'src/Utilities/verify-time-format.util';

export const saveReport = async ({
  report,
  reportRepo,
  user,
  reportId,
}: {
  report: crimeReportDTO;
  reportRepo: Repository<Report>;
  user: jwtPayload;
  reportId: string;
}) => {
  // ====== Convert time value to uppercase ======
  report.time = report.time.toUpperCase();

  const timeFormat = verifyTimeFormat.isTimeFormat(report.time);
  if (!timeFormat) {
    throw new BadRequestException('Time value is improper!');
  }

  try {
    // ====== Attach reportId and username to report object ======
    const updatedReport = { reportId, reported_by: user.username, ...report };

    // ====== Save user report to database and return reportId ======
    const userReport = reportRepo.create(updatedReport);
    await reportRepo.save(userReport);
    return { reportId };
  } catch (error) {
    console.log('ERROR: ', error);
    throw new BadRequestException('Unable to save user report!');
  }
};
