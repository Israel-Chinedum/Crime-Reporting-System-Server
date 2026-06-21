import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { generateToken } from './generate-token.util';

export const assignAccessToken = async ({
  req,
  jwtService,
  configService,
}: {
  req: Request;
  jwtService: JwtService;
  configService: ConfigService;
}) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedException('Token not found!');
  }

  try {
    const payload = await jwtService.verifyAsync(refreshToken, {
      secret: configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    return await generateToken({
      user: { username: payload.username, userId: payload.userId },
      type: 'access',
      jwtService,
      configService,
    });
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token!');
  }
};
