import prisma from "../../config/prisma";
import { stripe } from "../../config/stripe";
import { AppError } from "../../utils/AppError";

export const createPaymentIntent = async (
  customerId: string,
  bookingId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      payment: true,
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(403, "You can only pay for your own bookings");
  }

  if (booking.status !== "ACCEPTED") {
    throw new AppError(
      400,
      `Only accepted bookings can be paid for. Current status: ${booking.status}`,
    );
  }

  if (booking.payment && booking.payment.status === "COMPLETED") {
    throw new AppError(400, "This booking has already been paid for");
  }

  const amountCents = Math.round(Number(booking.priceAtBooking) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    metadata: {
      bookingId,
      customerId,
    },
  });

  const payment = booking.payment
    ? await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          transactionId: paymentIntent.id,
          amount: booking.priceAtBooking,
          status: "PENDING",
        },
      })
    : await prisma.payment.create({
        data: {
          bookingId,
          transactionId: paymentIntent.id,
          amount: booking.priceAtBooking,
          status: "PENDING",
        },
      });

  return {
    clientSecret: paymentIntent.client_secret,
    payment,
  };
};
