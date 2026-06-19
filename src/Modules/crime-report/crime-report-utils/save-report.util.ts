import { Repository } from 'typeorm';
import { Report } from '../report.entity';
import { crimeReportDTO } from '../crime-report-DTO/crime-report-dto';
import { BadRequestException } from '@nestjs/common';
import type { jwtPayload } from 'src/types/jwt-payload';

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

  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/;
  if (!timeRegex.test(report.time)) {
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

    // ====== Save user report to database ======
    const userReport = reportRepo.create(updatedReport);
    await reportRepo.save(userReport);
    return { message: 'Report saved!' };
  } catch (error) {
    console.log('ERROR: ', error);
    throw new BadRequestException('Unable to save user report!');
  }
};
