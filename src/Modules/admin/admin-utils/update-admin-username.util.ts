import { Repository } from 'typeorm';
import { Admin } from '../admin.entity';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtPayload } from 'src/types/jwt-payload';

export const updateAdminUsername = async ({
  username,
  password,
  adminRepo,
  user,
}: {
  username: string;
  password: string;
  adminRepo: Repository<Admin>;
  user: jwtPayload;
}) => {
  const admin = await adminRepo.findOne({ where: { username: user.username } });

  if (!admin) {
    throw new NotFoundException('Admin not found!');
  }

  const correctPassword = await bcrypt.compare(password, admin.password);

  if (!correctPassword) {
    throw new UnauthorizedException('Password is incorrect!');
  }

  try {
    await adminRepo.update({ username: user.username }, { username });
    return { message: 'Username has been updated successfully' };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('An error occured!');
  }
};
