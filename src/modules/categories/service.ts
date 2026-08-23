import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateCategoryInput } from "./validation";

export const createCategory = async (data: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    throw new AppError(400, "Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });

  return category;
};

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};
