export const sendReports = async ({ reportRepo }) => {
  const sendRecent = async () => {
    try {
      console.log('hello');
      return await reportRepo.find({
        order: { id: 'DESC' },
        take: 5,
      });
    } catch (error) {
      console.log('ERROR: ', error);
      return { error: 'Unable to get recent reports!' };
    }
  };

  const sendAll = async () => {
    try {
      console.log('fetch reports...');
      return await reportRepo.find();
    } catch (error) {
      console.log('ERROR: ', error);
      return { error: 'Unable to get reports!' };
    }
  };

  return { sendRecent, sendAll };
};
