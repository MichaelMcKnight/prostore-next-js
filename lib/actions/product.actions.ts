"use server";
import { prisma } from "@/db/client";
import "dotenv/config";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  const dataConverted = data.map((item) => ({
    ...item,
    price: item.price.toString(), // Decimal -> string
    rating: item.rating.toString(), // Decimal -> string
  }));

  return convertToPlainObject(dataConverted);
}

// Get single product by slug
export async function getProductABySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug: slug },
  });

  return convertToPlainObject(product);
}
