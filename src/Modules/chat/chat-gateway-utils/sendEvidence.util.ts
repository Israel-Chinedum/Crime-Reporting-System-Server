import { SupabaseClient } from '@supabase/supabase-js';

export const sendEvidence = async ({
  reportId,
  supabase,
}: {
  reportId: string;
  supabase: SupabaseClient;
}) => {
  const { data, error } = await supabase.storage
    .from('Crime reporting system files')
    .createSignedUrl(reportId, 60);

  if (error) {
    console.log('ERROR:', error);
    return { error: 'Unable to get url!' };
  }

  return data.signedUrl;
};
