import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 6);
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const getUserLoginToken = async (user: IUser): Promise<string> => {
  return await bcrypt.hash(`${user.name}-${user.email}-${user.pass}-${new Date().toISOString()}`, 2);
};
