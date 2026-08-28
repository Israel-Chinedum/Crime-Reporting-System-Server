import { Repository } from 'typeorm';
import { Admin } from '../admin.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/Modules/auth/auth-utils/generate-token.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const adminSignin = async ({
  username,
  password,
  adminRepo,
  configService,
  jwtService,
}: {
  username: string;
  password: string;
  adminRepo: Repository<Admin>;
  configService: ConfigService;
  jwtService: JwtService;
}) => {
  const admin = await adminRepo.findOne({ where: { username } });

  if (!admin) {
    throw new UnauthorizedException('Invalid username or password!');
  }

  const correctPassword = await bcrypt.compare(password, admin.password);

  if (!correctPassword) {
    throw new UnauthorizedException('Invalid username or password!');
  }

  const accessToken = await generateToken({
    user: { username: admin.username, userId: admin.id, role: 'admin' },
    type: 'access',
    configService,
    jwtService,
  });

  const refreshToken = await generateToken({
    user: { username: admin.username, userId: admin.id, role: 'admin' },
    type: 'refresh',
    configService,
    jwtService,
  });

  return { accessToken, refreshToken };
};
