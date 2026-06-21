import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { jwtPayload } from 'src/types/jwt-payload';

export const generateToken = async ({
  user,
  type,
  configService,
  jwtService,
}: {
  user: jwtPayload;
  type: 'access' | 'refresh';
  configService: ConfigService;
  jwtService: JwtService;
}) => {
  try {
    if (!user) {
      throw new Error(
        'user payload must be provided in order to generate access token!',
      );
    }

    //   ====== Set token type ======
    const tokenType =
      type === 'access' ? 'ACCESS_TOKEN_SECRET' : 'REFRESH_TOKEN_SECRET';

    // ====== Get token secret ======
    const secret = configService.get<string>(tokenType);

    //   ====== Return token ======
    return await jwtService.signAsync(user, {
      secret: secret,
      expiresIn: type === 'access' ? '1m' : '7d',
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException(
      'Unable to sign you in at the momemnt!',
    );
  }
};
