import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDTO } from './user-DTO/create-user-dto';
import { createUser } from './user-utils/create-user.util';
import { signinUserDTO } from './user-DTO/signin-user-dto';
import { signinUser } from './user-utils/signin-user.util';
import { AuthService } from '../auth/auth.service';
import { forgotPassword } from './user-utils/forgot-password.util';
import { RedisService } from '../Cache/redis.service';
import { updateUserPasswordDTO } from './user-DTO/update-user-password-dto';
import { updateUserPassword } from './user-utils/update-user-password.util';
import { updateUserProfile } from './user-utils/update-user-profile.util';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

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
  async forgotPassword(payload: { email: string }) {
    const redis = this.redisService.getClient();
    return await forgotPassword({ userRepo: this.userRepo, redis, payload });
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
}
