import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { Repository } from 'typeorm';
import { saveAlert } from './alert-util/save-alert.util';
import { saveAlertDTO } from './alert-DTO/save-alert-dto';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert) private readonly alertRepo: Repository<Alert>,
  ) {}

  async saveAlert(payload: saveAlertDTO) {
    await saveAlert({ alertRepo: this.alertRepo, payload });
    return { message: 'Alert saved' };
  }
}
