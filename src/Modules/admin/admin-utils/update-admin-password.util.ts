import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtPayload } from 'src/types/jwt-payload';
import { Repository } from 'typeorm';
import { Admin } from '../admin.entity';

export const updateAdminPassword = async ({
  payload,
  adminRepo,
}: {
  payload: {
    currentPassword: string;
    newPassword: string;
    user: jwtPayload;
  };
  adminRepo: Repository<Admin>;
}) => {
  const admin = await adminRepo.findOne({
    where: { username: payload.user.username },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found!');
  }

  const correctPassword = await bcrypt.compare(
    payload.currentPassword,
    admin.password,
  );

  if (!correctPassword) {
    throw new UnauthorizedException('Password is incorrect!');
  }

  try {
    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
    await adminRepo.update(
      { username: payload.user.username },
      { password: hashedPassword },
    );
    return { message: 'Password has been updated successfully' };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('An error occured!');
  }
};
