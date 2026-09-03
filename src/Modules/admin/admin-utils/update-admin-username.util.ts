import { Repository } from 'typeorm';
import { Admin } from '../admin.entity';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtPayload } from 'src/types/jwt-payload';
import { generateToken } from 'src/Modules/auth/auth-utils/generate-token.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const updateAdminUsername = async ({
  username,
  password,
  adminRepo,
  user,
  configService,
  jwtService,
}: {
  username: string;
  password: string;
  adminRepo: Repository<Admin>;
  user: jwtPayload;
  configService: ConfigService;
  jwtService: JwtService;
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
    const accessToken = await generateToken({
      user: { username, userId: admin.id, role: 'admin' },
      type: 'access',
      configService,
      jwtService,
    });
    return {
      message: 'Username has been updated successfully',
      data: username,
      accessToken,
    };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('An error occured!');
  }
};
