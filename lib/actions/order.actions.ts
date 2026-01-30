"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/client";
import { CartItem } from "@/types";

// Create order and create order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const cart = await getMyCart();
    const userId = session?.user?.id;

    if (!userId) throw new Error("User ID not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Cart is empty", redirectTo: "/cart" };
    }

    if (!user.address) {
      return {
        success: false,
        error: "No address found",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        error: "No payment method found",
        redirectTo: "/payment-method",
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create transaction to insert order and order items
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });

      // Create order items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }

      // Clear user's cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Failed to create order");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: formatError(error) };
  }
}
