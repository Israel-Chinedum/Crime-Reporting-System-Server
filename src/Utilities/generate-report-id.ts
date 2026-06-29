export const generateReportId = (count: number) => {
  // ====== Generate reportId ======
  const dateString = new Date().toISOString().split('T')[0];
  const reportCount = count < 9 ? `0${count + 1}` : `${count + 1}`;
  const reportId = `CR-${dateString}-${reportCount}`;
  return reportId;
};
