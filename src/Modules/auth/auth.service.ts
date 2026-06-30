import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { Repository } from 'typeorm';
import type { jwtPayload } from 'src/types/jwt-payload';
import type { Request } from 'express';
import { generateToken } from './auth-utils/generate-token.util';
import { assignAccessToken } from './auth-utils/assign-access-token';
import { doubleCsrf } from 'csrf-csrf';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ====== Generate access/refresh token ======
  async generateToken({
    user,
    type,
  }: {
    user: jwtPayload;
    type: 'access' | 'refresh';
  }) {
    return await generateToken({
      user,
      type,
      configService: this.configService,
      jwtService: this.jwtService,
    });
  }

  // ====== SAVE REFRESH TOKEN ======
  async saveRefreshToken(tokenPayload: { token: string; username: string }) {
    try {
      await this.tokenRepo.delete({ username: tokenPayload.username });
      const token = this.tokenRepo.create(tokenPayload);
      await this.tokenRepo.save(token);
    } catch (error) {
      console.log('ERROR: ', error);
      throw new InternalServerErrorException(
        'Unable to sign in user at the moment!',
      );
    }
  }

  // ====== ASSIGN NEW TOKENS ======
  async assignAccessToken(req: Request) {
    return await assignAccessToken({
      req,
      jwtService: this.jwtService,
      configService: this.configService,
    });
  }

  csrfMiddleware() {
    const { generateToken, doubleCsrfProtection } = doubleCsrf({
      getSecret: () => this.configService.get<string>('CSRF_SECRET'),
      cookieName: 'csrf_token',
      cookieOptions: {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        path: '/',
      },
      size: 64,
      ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    });
  }
}
