import type { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { ServicesQueryInput, TechniciansQueryInput } from "./validation";

export const getPublicServices = async (filters: ServicesQueryInput) => {
  const { categoryId, search, minPrice, maxPrice, location, sortBy } = filters;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ServiceWhereInput = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(search && { title: { contains: search, mode: "insensitive" } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined &&
          !Number.isNaN(Number(minPrice)) && { gte: Number(minPrice) }),
        ...(maxPrice !== undefined &&
          !Number.isNaN(Number(maxPrice)) && { lte: Number(maxPrice) }),
      },
    }),
    ...(location && {
      technicianProfile: {
        location: { contains: location, mode: "insensitive" },
      },
    }),
  };

  let orderBy: Prisma.ServiceOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price_desc") {
    orderBy = { price: "desc" };
  }

  const [items, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true },
        },
        technicianProfile: {
          select: {
            id: true,
            bio: true,
            location: true,
            avgRating: true,
            totalReviews: true,
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    }),
    prisma.service.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    totalPages,
  };
};

export const getPublicTechnicians = async (filters: TechniciansQueryInput) => {
  const { search, location, minRating, skills } = filters;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.TechnicianProfileWhereInput = {
    user: {
      status: "ACTIVE",
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
    ...(location && { location: { contains: location, mode: "insensitive" } }),
    ...(minRating !== undefined &&
      !Number.isNaN(Number(minRating)) && { gte: Number(minRating) }),
    ...(skills && { skills: { hasSome: [skills] } }),
  };

  const [items, total] = await Promise.all([
    prisma.technicianProfile.findMany({
      where,
      orderBy: { avgRating: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        bio: true,
        skills: true,
        experienceYears: true,
        hourlyRate: true,
        avgRating: true,
        totalReviews: true,
        location: true,
        createdAt: true,
        user: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.technicianProfile.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    totalPages,
  };
};

export const getTechnicianById = async (id: string) => {
  const technician = await prisma.technicianProfile.findFirst({
    where: {
      OR: [{ id }, { userId: id }],
    },
    select: {
      id: true,
      userId: true,
      bio: true,
      skills: true,
      experienceYears: true,
      hourlyRate: true,
      avgRating: true,
      totalReviews: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { id: true, name: true },
      },
      services: {
        where: { isActive: true },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician not found");
  }

  // TODO: reviews will be populated when reviews module is implemented
  return {
    ...technician,
    reviews: [],
  };
};
