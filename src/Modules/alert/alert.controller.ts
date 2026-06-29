import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AuthGuard } from '../auth/authGuard';
import { saveAlertDTO } from './alert-DTO/save-alert-dto';

@Controller('alert')
@UseGuards(AuthGuard)
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  async saveAlert(@Body() body: saveAlertDTO) {
    return await this.alertService.saveAlert(body);
  }
}
