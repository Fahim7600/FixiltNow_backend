import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateServiceInput, UpdateServiceInput } from "./validation";

export const createService = async (
  userId: string,
  data: CreateServiceInput,
) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      404,
      "Please create your technician profile before adding services",
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError(400, "Invalid category");
  }

  const service = await prisma.service.create({
    data: {
      technicianProfileId: profile.id,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      price: data.price,
    },
    include: {
      category: true,
    },
  });

  return service;
};

export const getMyServices = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      404,
      "Please create your technician profile before viewing services",
    );
  }

  const services = await prisma.service.findMany({
    where: { technicianProfileId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return services;
};

export const updateService = async (
  userId: string,
  serviceId: string,
  data: UpdateServiceInput,
) => {
  const existingService = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { technicianProfile: true },
  });

  if (!existingService) {
    throw new AppError(404, "Service not found");
  }

  if (existingService.technicianProfile.userId !== userId) {
    throw new AppError(403, "You can only modify your own services");
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError(400, "Invalid category");
    }
  }

  const updatedService = await prisma.service.update({
    where: { id: serviceId },
    data: {
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: {
      category: true,
    },
  });

  return updatedService;
};

export const deleteService = async (userId: string, serviceId: string) => {
  const existingService = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { technicianProfile: true },
  });

  if (!existingService) {
    throw new AppError(404, "Service not found");
  }

  if (existingService.technicianProfile.userId !== userId) {
    throw new AppError(403, "You can only modify your own services");
  }

  await prisma.service.delete({
    where: { id: serviceId },
  });

  return null;
};
