import { Repository } from 'typeorm';
import { Alert } from '../alert.entity';
import { saveAlertDTO } from '../alert-DTO/save-alert-dto';
import { verifyTimeFormat } from 'src/Utilities/verify-time-format.util';
import { BadRequestException } from '@nestjs/common';

export const saveAlert = async ({
  alertRepo,
  payload,
}: {
  alertRepo: Repository<Alert>;
  payload: saveAlertDTO;
}) => {
  const timeFormat = verifyTimeFormat.isTimeFormat(payload.time);
  if (!timeFormat) {
    throw new BadRequestException('Invalid time format!');
  }

  const alert = alertRepo.create(payload);
  await alertRepo.save(alert);

  return { alert };
};
