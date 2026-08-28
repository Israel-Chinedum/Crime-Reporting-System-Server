import { InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export const updateProfileImg = async ({
  supabase,
  file,
  username,
}: {
  supabase: SupabaseClient;
  file: Express.Multer.File;
  username: string;
}) => {
  const { error } = await supabase.storage
    .from('Profile Pictures')
    .upload(username, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.log(error);
    throw new InternalServerErrorException('Unable to save profile picture!');
  }

  return { message: 'Profile picture has been updated successfully' };
};
