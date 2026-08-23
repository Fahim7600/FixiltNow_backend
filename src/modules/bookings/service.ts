import type { BookingStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateBookingInput } from "./validation";

export const createBooking = async (
  customerId: string,
  data: CreateBookingInput,
) => {
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
    include: {
      technicianProfile: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!service) {
    throw new AppError(404, "Service not found");
  }

  if (!service.isActive) {
    throw new AppError(
      400,
      "This service is not currently available for booking",
    );
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianProfileId: service.technicianProfileId,
      serviceId: service.id,
      scheduledDate: new Date(data.scheduledDate),
      status: "REQUESTED",
      priceAtBooking: service.price,
      notes: data.notes,
    },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
      technicianProfile: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return booking;
};

export const getMyBookings = async (userId: string, role: string) => {
  if (role === "CUSTOMER") {
    const bookings = await prisma.booking.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        scheduledDate: true,
        status: true,
        priceAtBooking: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        service: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        technicianProfile: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      scheduledDate: booking.scheduledDate,
      status: booking.status,
      priceAtBooking: booking.priceAtBooking,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      service: booking.service,
      technician: {
        id: booking.technicianProfile.id,
        name: booking.technicianProfile.user.name,
      },
    }));
  }

  if (role === "TECHNICIAN") {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    const bookings = await prisma.booking.findMany({
      where: { technicianProfileId: profile.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        scheduledDate: true,
        status: true,
        priceAtBooking: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        service: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      scheduledDate: booking.scheduledDate,
      status: booking.status,
      priceAtBooking: booking.priceAtBooking,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      service: booking.service,
      customer: {
        id: booking.customer.id,
        name: booking.customer.name,
      },
    }));
  }

  return [];
};

export const getBookingById = async (
  userId: string,
  role: string,
  bookingId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      technicianProfileId: true,
      scheduledDate: true,
      status: true,
      priceAtBooking: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      technicianProfile: {
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  const isCustomerOwner = role === "CUSTOMER" && booking.customerId === userId;
  const isTechnicianOwner =
    role === "TECHNICIAN" && booking.technicianProfile.userId === userId;

  if (!isCustomerOwner && !isTechnicianOwner && role !== "ADMIN") {
    throw new AppError(403, "You do not have permission to view this booking");
  }

  return {
    id: booking.id,
    scheduledDate: booking.scheduledDate,
    status: booking.status,
    priceAtBooking: booking.priceAtBooking,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    service: booking.service,
    customer: {
      id: booking.customer.id,
      name: booking.customer.name,
    },
    technician: {
      id: booking.technicianProfile.id,
      name: booking.technicianProfile.user.name,
    },
  };
};

export const updateBookingStatus = async (
  userId: string,
  bookingId: string,
  newStatus: BookingStatus,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      technicianProfile: true,
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.technicianProfile.userId !== userId) {
    throw new AppError(403, "You can only manage your own bookings");
  }

  const allowedTransitions: Record<string, string[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED"],
    ACCEPTED: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
  };

  const validNextStatuses = allowedTransitions[booking.status] || [];

  if (!validNextStatuses.includes(newStatus)) {
    throw new AppError(
      400,
      `Invalid status transition from ${booking.status} to ${newStatus}`,
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      technicianProfile: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return updatedBooking;
};
