import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { jwtPayload } from 'src/types/jwt-payload';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const getUserProfile = async ({
  userRepo,
  user,
}: {
  userRepo: Repository<User>;
  user: jwtPayload;
}) => {
  try {
    const userDetails = await userRepo.findOne({
      where: { username: user.username },
    });

    if (userDetails) {
      return userDetails;
    } else {
      throw new Error('User not found!');
    }
  } catch (error: any) {
    console.log(error);
    if (error?.message === 'User not found!') {
      throw new NotFoundException(error.message);
    } else {
      throw new InternalServerErrorException('An error occured!');
    }
  }
};
