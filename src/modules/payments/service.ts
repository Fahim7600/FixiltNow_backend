import type Stripe from "stripe";
import { config } from "../../config/env";
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
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
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

export const handleWebhookEvent = async (
  rawBody: Buffer | string,
  signature: string,
) => {
  if (!signature) {
    throw new AppError(400, "Webhook signature verification failed");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret,
    );
  } catch (err: unknown) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    throw new AppError(
      400,
      "Webhook signature verification failed",
      errorDetails,
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const payment = await prisma.payment.findUnique({
      where: { transactionId: paymentIntent.id },
    });

    if (!payment) {
      console.warn(
        `Payment record not found for transactionId: ${paymentIntent.id}`,
      );
      return { received: true };
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          paidAt: new Date(),
        },
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: "PAID",
        },
      }),
    ]);
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const payment = await prisma.payment.findUnique({
      where: { transactionId: paymentIntent.id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
        },
      });
    }
  }

  return { received: true };
};

export const getMyPayments = async (userId: string, role: string) => {
  if (role !== "CUSTOMER") {
    throw new AppError(
      403,
      "Forbidden",
      "Only customers can view their payment history",
    );
  }

  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: {
        select: {
          id: true,
          scheduledDate: true,
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments;
};

export const getPaymentById = async (
  userId: string,
  role: string,
  paymentId: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        select: {
          id: true,
          customerId: true,
          scheduledDate: true,
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  if (role === "CUSTOMER" && payment.booking.customerId !== userId) {
    throw new AppError(403, "You do not have permission to view this payment");
  }

  return payment;
};
