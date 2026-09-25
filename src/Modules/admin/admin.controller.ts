import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { adminSigninDTO } from './adminDTO/admin-signin.dto';
import { UpdateAdminPasswordDTO } from './adminDTO/update-admin-password.dto';
import { type Request } from 'express';
import { UpdateAdminUsernameDTO } from './adminDTO/update-admin-username.dto';
import { AuthGuard } from '../auth/authGuard';
import { WeeklyReportsDTO } from './adminDTO/weekly-reports.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/signin')
  async adminSignin(@Body() payload: adminSigninDTO) {
    const { refreshToken, accessToken } =
      await this.adminService.adminSignin(payload);

    return { refreshToken, accessToken, access: 'granted', role: 'admin' };
  }

  @Post('/update-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Body() payload: UpdateAdminPasswordDTO,
    @Req() req: Request,
  ) {
    return await this.adminService.updatePassword({
      ...payload,
      user: req.user!,
    });
  }

  @Post('/update-username')
  @UseGuards(AuthGuard)
  async updateUsername(
    @Body() payload: UpdateAdminUsernameDTO,
    @Req() req: Request,
  ) {
    return await this.adminService.updateUsername({
      ...payload,
      user: req.user!,
    });
  }

  @Post('/weekly-reports')
  @UseGuards(AuthGuard)
  async getWeeklyReports(@Body() payload: WeeklyReportsDTO) {
    return await this.adminService.weeklyReports(payload);
  }

  @Get('/get-admin-data')
  @UseGuards(AuthGuard)
  async getAdminData(@Req() req: Request) {
    console.log('USER: ', req.user);
    return await this.adminService.getAdminData(req.user!);
  }
}
