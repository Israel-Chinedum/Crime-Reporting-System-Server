import { emitNewReport } from 'src/Utilities/newReportEmitter';
import { MoreThan } from 'typeorm';

export const relayAlert = async ({ reportId, reportRepo, server }) => {
  try {
    const report = await reportRepo.findOne({ where: { reportId } });
    server.to('admin_user').emit('report-notification', report);

    await emitNewReport({ reportRepo, server });
  } catch (error) {
    console.log('ERROR:', error);
  }
};
