import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateReviewInput } from "./validation";

export const createReview = async (
  customerId: string,
  data: CreateReviewInput,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: {
      review: true,
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(403, "You can only review your own bookings");
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(400, "You can only review completed bookings");
  }

  if (booking.review) {
    throw new AppError(400, "You have already reviewed this booking");
  }

  const review = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        bookingId: data.bookingId,
        customerId,
        technicianProfileId: booking.technicianProfileId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    const stats = await tx.review.aggregate({
      where: { technicianProfileId: booking.technicianProfileId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avgRating = stats._avg.rating
      ? Number(stats._avg.rating.toFixed(2))
      : 0;
    const totalReviews = stats._count.rating || 0;

    await tx.technicianProfile.update({
      where: { id: booking.technicianProfileId },
      data: {
        avgRating,
        totalReviews,
      },
    });

    return newReview;
  });

  return review;
};

export const getTechnicianReviews = async (technicianProfileId: string) => {
  const reviews = await prisma.review.findMany({
    where: { technicianProfileId },
    include: {
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    customerName: r.customer.name,
  }));
};
