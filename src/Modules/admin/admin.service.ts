import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Between, Repository } from 'typeorm';
import { jwtPayload } from 'src/types/jwt-payload';
import { updateAdminPassword } from './admin-utils/update-admin-password.util';
import { updateAdminUsername } from './admin-utils/update-admin-username.util';
import { adminSignin } from './admin-utils/admin-signin.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { adminSigninDTO } from './adminDTO/admin-signin.dto';
import { Report } from '../crime-report/crime-report-entities/report.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // ======= UPDATE ADMIN PASSWORD ======
  async updatePassword(payload: {
    currentPassword: string;
    newPassword: string;
    user: jwtPayload;
  }) {
    return await updateAdminPassword({ payload, adminRepo: this.adminRepo });
  }

  // ====== UPDATE ADMIN USERNAME ======
  async updateUsername(payload: {
    username: string;
    password: string;
    user: jwtPayload;
  }) {
    return await updateAdminUsername({
      username: payload.username,
      password: payload.password,
      user: payload.user,
      adminRepo: this.adminRepo,
      configService: this.configService,
      jwtService: this.jwtService,
    });
  }

  // ====== GET ADMIN DATA ======
  async getAdminData(user: jwtPayload) {
    const admin = await this.adminRepo.findOne({
      where: { username: user?.username },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found!');
    }

    return { username: admin.username };
  }

  // ===== SIGN IN ADMIN ======
  async adminSignin(payload: adminSigninDTO) {
    return await adminSignin({
      username: payload.username,
      password: payload.password,
      adminRepo: this.adminRepo,
      jwtService: this.jwtService,
      configService: this.configService,
    });
  }

  // ====== NUMBER OF REPORTS ON EACH DAY OF THE CURRENT WEEK ======
  async weeklyReports({
    startOfWeek,
    endOfWeek,
  }: {
    startOfWeek: Date;
    endOfWeek: Date;
  }) {
    const startTimestamp = startOfWeek;
    const endTimestamp = endOfWeek;

    try {
      const weeklyReports = await this.reportRepo.find({
        select: { createdAt: true },
        where: { createdAt: Between(startTimestamp, endTimestamp) },
      });

      return weeklyReports;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('An error occured!');
    }
  }
}
