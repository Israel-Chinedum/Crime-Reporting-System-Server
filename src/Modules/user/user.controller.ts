import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { createUserDTO } from './user-DTO/create-user-dto';
import { UserService } from './user.service';
import { signinUserDTO } from './user-DTO/signin-user-dto';
import { type Response } from 'express';
import { AuthGuard } from '../auth/authGuard';
import { updateUserPasswordDTO } from './user-DTO/update-user-password-dto';

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
    const { accessToken, refreshToken } =
      await this.userService.signinUser(body);

    // ====== Send refresh token cookie ======
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    // ====== Send access token cookie ======
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  // ====== TEST AUTH GURAD ======
  // @UseGuards(AuthGuard)
  @Post('/forgot-password')
  async forgotPassword(@Body() body: { email: string }, @Req() req: any) {
    return this.userService.forgotPassword(body);
  }

  @Post('/update-password')
  async updatePassword(@Body() body: updateUserPasswordDTO) {
    return this.userService.updateUserPassword(body);
  }
}
