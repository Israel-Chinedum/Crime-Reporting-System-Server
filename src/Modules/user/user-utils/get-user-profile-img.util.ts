import { InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export const getUserProfileImg = async ({
  supabase,
  username,
}: {
  supabase: SupabaseClient;
  username: string;
}) => {
  const { data, error } = await supabase.storage
    .from('Profile Pictures')
    .createSignedUrl(username, 60 * 60);

  if (error) {
    console.log(error);
    throw new InternalServerErrorException('Unable to get profile image!');
  }

  return { url: data.signedUrl };
};
