import { ConflictException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createUserDTO } from '../user-DTO/create-user-dto';

export const createUser = async ({
  userRepo,
  payload,
}: {
  userRepo: Repository<User>;
  payload: createUserDTO;
}) => {
  // ====== Check if email already exists ======
  const emailExists = await userRepo.findOne({
    where: { email: payload.email },
  });

  if (emailExists) throw new ConflictException('Email already exists!');

  // ====== Check if username already exists ======
  const usernameExists = await userRepo.findOne({
    where: { username: payload.username },
  });

  if (usernameExists)
    throw new ConflictException('Username has already been taken!');

  // ====== Hash user password ======
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // ====== Define user data without password ======
  const userData = {
    fullname: payload.fullname,
    department: payload.department,
    Matric_Number: payload.Matric_Number,
    Phone_Number: payload.Phone_Number,
    email: payload.email,
    username: payload.username,
  };

  // ====== Save user data to database ======
  const user = userRepo.create({
    ...userData,
    password: hashedPassword,
  });
  await userRepo.save(user);

  // ====== Return user data without password ======
  return { message: 'Registration successfull!' };
};
