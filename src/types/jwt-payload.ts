export type jwtPayload = {
  username: string;
  userId: number;
  role: 'admin' | 'user';
};
