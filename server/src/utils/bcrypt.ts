import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const passwordUtils = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(String(password), SALT_ROUNDS);
  },

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(String(plainPassword), hashedPassword);
  },
};
