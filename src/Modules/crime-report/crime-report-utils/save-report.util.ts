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
}: {
  report: crimeReportDTO;
  reportRepo: Repository<Report>;
  user: jwtPayload;
}) => {
  // ====== Convert time value to uppercase ======
  report.time = report.time.toUpperCase();

  const timeFormat = verifyTimeFormat.isTimeFormat(report.time);
  if (!timeFormat) {
    throw new BadRequestException('Time value is improper!');
  }

  try {
    // ====== Generate and pass in reportId ======
    const dateString = new Date().toISOString().split('T')[0];
    let reportCount: string | number = await reportRepo.count();
    reportCount =
      reportCount < 10 ? `0${reportCount + 1}` : `${reportCount + 1}`;

    const reportId = `CR-${dateString}-${reportCount}`;

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
