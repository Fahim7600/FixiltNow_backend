import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { config } from "../../config/env";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { LoginInput, RegisterInput } from "./validation";

export const registerUser = async (data: RegisterInput) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: data.phone?.trim(),
      role: data.role,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (data: LoginInput) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError(400, "Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(data.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(400, "Invalid credentials");
  }

  if (user.status === "BANNED") {
    throw new AppError(400, "Account has been suspended");
  }

  const secret: Secret = config.jwt.secret;
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    secret,
    options,
  );

  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword,
  };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
