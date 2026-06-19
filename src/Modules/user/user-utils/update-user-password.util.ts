import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { RedisClientType } from 'redis';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { updateUserPasswordDTO } from '../user-DTO/update-user-password-dto';

export const updateUserPassword = async ({
  userRepo,
  payload,
  redis,
}: {
  userRepo: Repository<User>;
  payload: updateUserPasswordDTO;
  redis: RedisClientType;
}) => {
  const otp = await redis.get(payload.email);
  if (!otp) {
    throw new UnauthorizedException('Invalid or expired OTP!');
  }

  if (payload.otp !== otp) {
    throw new UnauthorizedException('Invalid or expired OTP!');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  await userRepo.update({ email: payload.email }, { password: hashedPassword });

  return { message: 'Your password has been updated!' };
};
