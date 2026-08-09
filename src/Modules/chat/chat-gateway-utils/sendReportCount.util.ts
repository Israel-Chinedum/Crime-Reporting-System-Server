export const sendReportCount = async ({ reportRepo }) => {
  try {
    // ====== Get report counts ======
    // total reports
    const reportCount = await reportRepo.count();
    // total active reports
    const activeReportCount = await reportRepo.count({
      where: { status: 'active' },
    });
    // total resovled reorts
    const resolvedReportCount = await reportRepo.count({
      where: { status: 'resolved' },
    });

    const emergencyReportCount = await reportRepo.count({
      where: { type: 'emergency' },
    });

    return {
      reportCount,
      activeReportCount,
      resolvedReportCount,
      emergencyReportCount,
    };
  } catch (error) {
    console.log('ERROR: ', error);
    return {
      error: 'Unable to get number of reports!',
    };
  }
};
