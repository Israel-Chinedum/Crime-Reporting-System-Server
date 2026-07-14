import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { crimeReportDTO } from './crime-report-DTO/crime-report-dto';
import type { Request } from 'express';
import { AuthGuard } from '../auth/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

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
  }

  // @Post('/evidence')
  // @UseInterceptors(FileInterceptor('file'))
  // async saveEvidence(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   return { message: 'File has been received!' };
  // }
}
