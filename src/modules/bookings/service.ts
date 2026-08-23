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
