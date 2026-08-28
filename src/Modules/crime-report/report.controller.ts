import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { crimeReportDTO } from './crime-report-DTO/crime-report-dto';
import type { Request } from 'express';
import { AuthGuard } from '../auth/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('report')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async saveReport(
    @Body() body: crimeReportDTO,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.user) {
      console.log('FILE: ', file);
      return await this.reportService.saveReport({
        body,
        user: req.user,
        file,
      });
    }
    throw new UnauthorizedException('Unauthorized user access!');
  }

  @Get()
  async getUserReports(@Req() req: Request) {
    if (req.user) {
      return await this.reportService.getUserReports({ user: req.user });
    }
  }

  // @Post('/evidence')
  // @UseInterceptors(FileInterceptor('file'))
  // async saveEvidence(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   return { message: 'File has been received!' };
  // }
}
