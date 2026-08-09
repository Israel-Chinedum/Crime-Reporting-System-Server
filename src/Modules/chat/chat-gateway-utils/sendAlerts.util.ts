import { MoreThan } from 'typeorm';

export const sendAlerts = async ({ reportRepo }) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
    //   ====== Get active reports within 24 hours ======
    const reports = await reportRepo.find({
      where: { createdAt: MoreThan(twentyFourHoursAgo) },
    });
    return reports;
  } catch (error) {
    console.log('ERROR:', error);
    return { error: 'Unable to get alerts!' };
  }
};
