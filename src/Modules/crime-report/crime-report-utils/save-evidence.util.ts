import { BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Repository } from 'typeorm';
import { Report } from '../crime-report-entities/report.entity';

export const saveEvidence = async ({
  file,
  supabase,
  reportId,
}: {
  file: Express.Multer.File;
  supabase: SupabaseClient;
  reportId: string;
}) => {
  const { data, error } = await supabase.storage
    .from('Crime reporting system files')
    .upload(reportId, file.buffer, { contentType: file.mimetype });

  if (error) {
    console.log('ERROR: ', error);
    throw new BadRequestException('Unable to save report!');
  }

  return reportId;
};
