import { SecurityTip } from 'src/Entities/saveTip.entity';
import { Repository } from 'typeorm';

export const saveTip = async ({
  securityTipRepo,
  payload,
}: {
  securityTipRepo: Repository<SecurityTip>;
  payload: { title: string; message: string };
}) => {
  try {
    const tipExists = await securityTipRepo.findOne({
      where: { title: payload.title },
    });

    if (tipExists) {
      return { error: 'A tip with same title already exists!' };
    }

    await securityTipRepo.save(securityTipRepo.create(payload));
    const tips = await securityTipRepo.find();

    return { message: 'Tip has been saved', data: tips };
  } catch (error) {
    console.log(error);
    return { error: 'Unable to save tip!' };
  }
};
