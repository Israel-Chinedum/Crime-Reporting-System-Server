import { Server } from 'socket.io';
import { Report } from 'src/Modules/crime-report/crime-report-entities/report.entity';
import { MoreThan, Repository } from 'typeorm';

export const emitNewReport = async ({
  reportRepo,
  server,
  callback = null,
}: {
  reportRepo: Repository<Report>;
  server: Server;
  callback?: any;
}) => {
  const twentyFourHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);

  const newReports = await reportRepo.find({
    where: { createdAt: MoreThan(twentyFourHoursAgo) },
  });

  const filteredNewReports: any = [];

  if (!newReports.length) {
    if (callback) return [];
    return;
  }

  for (let report of newReports) {
    filteredNewReports.push({
      incident_type: report?.incident_type,
      reported_by: report?.reported_by,
      description: report?.description,
      location:
        report?.actual_location.toLowerCase() === 'unavailable'
          ? report?.location
          : report?.actual_location,
      time: report?.time,
      date: report?.date,
    });
  }

  if (!callback) {
    server.emit('notification', filteredNewReports);
  } else {
    return filteredNewReports;
  }
};
