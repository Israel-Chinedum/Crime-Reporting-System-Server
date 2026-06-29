import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { signinUserDTO } from '../user-DTO/signin-user-dto';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/Modules/auth/auth.service';
import * as bcrypt from 'bcrypt';

export const signinUser = async ({
  userRepo,
  payload,
  authService,
}: {
  userRepo: Repository<User>;
  payload: signinUserDTO;
  authService: AuthService;
}) => {
  //  ====== Check if user exists ======
  const user = await userRepo.findOne({
    where: { username: payload.username },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid username or password!');
  }

  //   ====== Check if password is correct ======
  const correctPassword = await bcrypt.compare(payload.password, user.password);
  if (!correctPassword) {
    throw new UnauthorizedException('Invalid username or password!');
  }

  const accessToken = await authService.generateToken({
    user: {
      username: user.username,
      userId: user.id,
      role: user.role,
    },
    type: 'access',
  });

  const refreshToken = await authService.generateToken({
    user: {
      username: user.username,
      userId: user.id,
      role: user.role,
    },
    type: 'refresh',
  });

  await authService.saveRefreshToken({
    token: refreshToken,
    username: user.username,
  });

  return { accessToken, refreshToken, role: user.role, access: 'granted' };
};
