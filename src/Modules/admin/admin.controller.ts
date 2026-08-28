import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { adminSigninDTO } from './adminDTO/admin-signin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/signin')
  async adminSignin(@Body() payload: adminSigninDTO) {
    const { refreshToken, accessToken } =
      await this.adminService.adminSignin(payload);

    return { refreshToken, accessToken, access: 'granted' };
  }
}
