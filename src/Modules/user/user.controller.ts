import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { createUserDTO } from './user-DTO/create-user-dto';
import { UserService } from './user.service';
import { signinUserDTO } from './user-DTO/signin-user-dto';
import { type Response } from 'express';
import { AuthGuard } from '../auth/authGuard';
import { updateUserPasswordDTO } from './user-DTO/update-user-password-dto';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ====== HANDLE CREATE USER REQUESTS ======
  @Post()
  async saveUser(@Body() body: createUserDTO) {
    return await this.userService.createUser(body);
  }

  // ====== HANDLE USER SIGNIN ======
  @Post('/signin')
  async loginUser(
    @Body() body: signinUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.signinUser(body);
  }

  // ====== SEND OTP ROUTE ======
  @Post('/send-otp')
  async forgotPassword(@Body() body: { email: string }) {
    return this.userService.sendOTP(body);
  }

  // ====== UPDATE USER PASSWORD ROUTE ======
  @Post('/update-password')
  async updatePassword(@Body() body: updateUserPasswordDTO) {
    return this.userService.updateUserPassword(body);
  }

  // ====== UPDATE USER PROFILE ======
  @Post('/update-profile')
  @UseGuards(AuthGuard)
  async updateUserProfile(@Body() body: createUserDTO, @Req() req: Request) {
    return this.userService.updateUserProfile({ payload: body, req });
  }

  @Post('/set-profile-pic')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async setProfilePic(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return (
      req.user &&
      (await this.userService.updateUserProfileImg({
        file,
        username: req.user?.username,
      }))
    );
  }

  // ====== GET USER PROFILE PICTURE ======
  @Get('/get-user-profile-pic')
  @UseGuards(AuthGuard)
  async getUserProfilePic(@Req() req: Request) {
    return (
      req.user &&
      (await this.userService.getUserProfilePic({
        username: req.user.username,
      }))
    );
  }

  // ====== GET USER PROFILE ======
  @Get('/get-user-profile')
  @UseGuards(AuthGuard)
  async getUserProfile(@Req() req: Request) {
    return req.user && (await this.userService.getUserProfile(req.user));
  }
}
