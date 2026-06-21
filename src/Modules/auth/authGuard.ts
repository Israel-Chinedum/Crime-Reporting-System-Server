import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new UnauthorizedException('Token not found!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      req.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token!');
    }
  }
}
