import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { createUserDTO } from '../user-DTO/create-user-dto';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const updateUserProfile = async ({
  userRepo,
  payload,
  req,
}: {
  userRepo: Repository<User>;
  payload: createUserDTO;
  req: Request;
}) => {
  const user = await userRepo.findOne({
    where: { username: req.user?.username },
  });

  if (!user) {
    throw new UnauthorizedException('Unauthorized user access!');
  }

  const passwordCorrect = await bcrypt.compare(payload.password, user.password);

  if (!passwordCorrect) {
    throw new UnauthorizedException('Password is incorrect!');
  }

  const { password, ...updatedProfileData } = payload;

  await userRepo.update({ username: user.username }, updatedProfileData);

  return { message: updatedProfileData };
};
