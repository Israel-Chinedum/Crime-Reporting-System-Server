import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { createUserDTO } from './user-DTO/create-user-dto';
import { UserService } from './user.service';
import { signinUserDTO } from './user-DTO/signin-user-dto';
import { type Response } from 'express';
import { AuthGuard } from '../auth/authGuard';
import { updateUserPasswordDTO } from './user-DTO/update-user-password-dto';
import type { Request } from 'express';

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

  // ====== FORGOT PASSWORD ROUTE: To send otp for forgotten password ======
  @Post('/forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.userService.forgotPassword(body);
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
}
