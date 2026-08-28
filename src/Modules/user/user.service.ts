import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDTO } from './user-DTO/create-user-dto';
import { createUser } from './user-utils/create-user.util';
import { signinUserDTO } from './user-DTO/signin-user-dto';
import { signinUser } from './user-utils/signin-user.util';
import { AuthService } from '../auth/auth.service';
import { sendOTP } from './user-utils/send-otp.util';
import { RedisService } from '../Cache/redis.service';
import { updateUserPasswordDTO } from './user-DTO/update-user-password-dto';
import { updateUserPassword } from './user-utils/update-user-password.util';
import { updateUserProfile } from './user-utils/update-user-profile.util';
import { Request } from 'express';
import { getUserProfile } from './user-utils/get-user-profile.util';
import { jwtPayload } from 'src/types/jwt-payload';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { updateProfileImg } from './user-utils/updateProfileImg.util';
import { getUserProfileImg } from './user-utils/get-user-profile-img.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  supabase() {
    return createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  //   ====== CREATE NEW USER ======
  async createUser(payload: createUserDTO) {
    const userRepo = this.userRepo;
    return await createUser({ userRepo, payload });
  }

  // ====== SIGN IN USER ======
  async signinUser(payload: signinUserDTO) {
    return await signinUser({
      userRepo: this.userRepo,
      payload,
      authService: this.authService,
    });
  }

  // ====== SEND OTP FOR FORGOTTEN PASSWORD ======
  async sendOTP(payload: { email: string }) {
    const redis = this.redisService.getClient();
    return await sendOTP({ userRepo: this.userRepo, redis, payload });
  }

  // ====== UPDATE USER PASSWORD ======
  async updateUserPassword(payload: updateUserPasswordDTO) {
    return await updateUserPassword({
      payload,
      redis: this.redisService.getClient(),
      userRepo: this.userRepo,
    });
  }

  // ====== UPDATE USER PROFILE ======
  async updateUserProfile({
    payload,
    req,
  }: {
    payload: createUserDTO;
    req: Request;
  }) {
    return await updateUserProfile({ userRepo: this.userRepo, payload, req });
  }

  // ====== GET USER DETAILS ======
  async getUserProfile(user: jwtPayload) {
    return await getUserProfile({ userRepo: this.userRepo, user });
  }

  // ====== UPDATE USER PROFILE PIC ======
  async updateUserProfileImg({
    file,
    username,
  }: {
    file: Express.Multer.File;
    username: string;
  }) {
    try {
      if (!file) throw new BadRequestException('File not found!');
      if (!username)
        throw new BadRequestException('Username must be provided!');

      return await updateProfileImg({
        supabase: this.supabase(),
        file,
        username,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occured!');
    }
  }

  // ====== GET USER PROFILE PICTURE ======
  async getUserProfilePic({ username }: { username: string }) {
    if (!username) throw new BadRequestException('Username must be provided!');
    return await getUserProfileImg({ supabase: this.supabase(), username });
  }
}
