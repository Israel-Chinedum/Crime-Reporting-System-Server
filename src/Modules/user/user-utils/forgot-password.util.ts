import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { ConflictException } from '@nestjs/common';
import { generateOTP } from 'src/Utilities/generate-OTP.util';
import { sendMail } from 'src/Utilities/sendEmail.util';
import { RedisClientType } from 'redis';

export const forgotPassword = async ({
  userRepo,
  payload,
  redis,
}: {
  userRepo: Repository<User>;
  payload: { email: string };
  redis: RedisClientType;
}) => {
  // ====== Check if email exists ======
  const user = await userRepo.findOne({ where: { email: payload.email } });
  if (!user) {
    throw new ConflictException('Cannot find email!');
  }

  const otp = generateOTP();

  await redis.set(user.email, otp, { EX: 60 });
  console.log('REDIS EMAIL', await redis.get(user.email));

  return await sendMail({
    otp,
    email: user.email,
    successMsg:
      'An OTP has been sent to your email and will expire within 60 seconds!',
    errMsg: 'Unable to send OTP at the moment!',
  });
};
