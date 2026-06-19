import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateToken({
    user,
    type,
  }: {
    user: { username: string; userId: number };
    type: 'access' | 'refresh';
  }) {
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
      const secret = this.configService.get<string>(tokenType);

      //   ====== Return token ======
      return await this.jwtService.signAsync(user, {
        secret: secret,
        expiresIn: type === 'access' ? '2m' : '30m',
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Unable to sign you in at the momemnt!',
      );
    }
  }
}
