import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateAvailabilityInput } from "./validation";

export const addAvailability = async (
  userId: string,
  data: CreateAvailabilityInput,
) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      404,
      "Please create your technician profile before adding availability",
    );
  }

  const existingSlots = await prisma.availability.findMany({
    where: {
      technicianProfileId: profile.id,
      dayOfWeek: data.dayOfWeek,
    },
  });

  const hasOverlap = existingSlots.some(
    (slot) => data.startTime < slot.endTime && data.endTime > slot.startTime,
  );

  if (hasOverlap) {
    throw new AppError(
      400,
      "This time slot overlaps with an existing availability window",
    );
  }

  const availability = await prisma.availability.create({
    data: {
      technicianProfileId: profile.id,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  return availability;
};

export const getMyAvailability = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      404,
      "Please create your technician profile before viewing availability",
    );
  }

  const availability = await prisma.availability.findMany({
    where: { technicianProfileId: profile.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return availability;
};

export const deleteAvailability = async (
  userId: string,
  availabilityId: string,
) => {
  const existingSlot = await prisma.availability.findUnique({
    where: { id: availabilityId },
    include: { technicianProfile: true },
  });

  if (!existingSlot) {
    throw new AppError(404, "Availability window not found");
  }

  if (existingSlot.technicianProfile.userId !== userId) {
    throw new AppError(
      403,
      "You can only delete your own availability windows",
    );
  }

  await prisma.availability.delete({
    where: { id: availabilityId },
  });

  return null;
};
