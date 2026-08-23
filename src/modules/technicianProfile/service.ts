import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { UpsertProfileInput } from "./validation";

export const upsertProfile = async (
  userId: string,
  data: UpsertProfileInput,
) => {
  const profile = await prisma.technicianProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      skills: data.skills,
      experienceYears: data.experienceYears,
      hourlyRate: data.hourlyRate,
    },
    create: {
      userId,
      bio: data.bio,
      skills: data.skills,
      experienceYears: data.experienceYears,
      hourlyRate: data.hourlyRate,
    },
  });

  return profile;
};

export const getMyProfile = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      404,
      "Profile not found. Please create your technician profile first.",
    );
  }

  return profile;
};
