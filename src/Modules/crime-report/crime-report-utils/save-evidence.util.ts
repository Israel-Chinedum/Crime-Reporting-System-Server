import { InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export const saveEvidence = async ({
  file,
  supabase,
  reportId,
}: {
  file: Express.Multer.File;
  supabase: SupabaseClient;
  reportId: string;
}) => {
  const { error } = await supabase.storage
    .from('Crime reporting system files')
    .upload(reportId, file.buffer, { contentType: file.mimetype });

  if (error) {
    console.log('ERROR: ', error);
    throw new InternalServerErrorException('Unable to save report!');
  }
};
