export const updateReport = async ({
  reportRepo,
  reportId,
  action,
  supabase,
}) => {
  if (action !== 'resolved' && action !== 'active' && action !== 'delete') {
    return { error: 'Invalid operation!' };
  }

  if (!reportId) {
    return { error: 'reportId must be provided!' };
  }

  if (action === 'delete') {
    try {
      // Delete report evidence
      const { error } = await supabase.storage
        .from('Crime reporting system files')
        .remove([reportId]);

      if (error) {
        throw error;
      }

      // Delete file from reports table in database
      await reportRepo.delete({ reportId });
      return 'Report has been deleted';
    } catch (error) {
      console.log('ERROR:', error);
      return { error: 'Unable to delete this report!' };
    }
  }

  try {
    await reportRepo.update({ reportId }, { status: action });
    return `Report status has been set to ${action}`;
  } catch (error) {
    console.log('ERROR:', error);
    return { error: 'Unable to update report status!' };
  }
};
