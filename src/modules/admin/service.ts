import type { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { getAllCategories as fetchAllCategories } from "../categories/service";
import type {
  AdminBookingsQueryInput,
  AdminPaymentsQueryInput,
  AdminUsersQueryInput,
} from "./validation";

export const getAllUsers = async (filters: AdminUsersQueryInput) => {
  const { role, status } = filters;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(role && { role }),
    ...(status && { status }),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    totalPages,
  };
};

export const updateUserStatus = async (
  targetUserId: string,
  newStatus: UserStatus,
) => {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new AppError(404, "User not found");
  }

  if (targetUser.role === "ADMIN") {
    throw new AppError(400, "Cannot change status of an admin account");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { status: newStatus },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const getAllBookings = async (filters: AdminBookingsQueryInput) => {
  const { status } = filters;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {
    ...(status && { status }),
  };

  const [rawItems, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        customer: {
          select: { name: true },
        },
        technicianProfile: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        service: {
          select: { title: true },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  const items = rawItems.map((b) => ({
    id: b.id,
    scheduledDate: b.scheduledDate,
    status: b.status,
    priceAtBooking: b.priceAtBooking,
    notes: b.notes,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    serviceTitle: b.service.title,
    customerName: b.customer.name,
    technicianName: b.technicianProfile.user.name,
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    totalPages,
  };
};

export const getAllPayments = async (filters: AdminPaymentsQueryInput) => {
  const { status } = filters;
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {
    ...(status && { status }),
  };

  const [rawItems, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        booking: {
          select: {
            scheduledDate: true,
            customer: {
              select: { name: true },
            },
            technicianProfile: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
            service: {
              select: { title: true },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  const items = rawItems.map((p) => ({
    id: p.id,
    bookingId: p.bookingId,
    transactionId: p.transactionId,
    amount: p.amount,
    method: p.method,
    provider: p.provider,
    status: p.status,
    paidAt: p.paidAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    scheduledDate: p.booking.scheduledDate,
    serviceTitle: p.booking.service.title,
    customerName: p.booking.customer.name,
    technicianName: p.booking.technicianProfile.user.name,
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    totalPages,
  };
};

export const getAllCategories = async () => {
  return await fetchAllCategories();
};
