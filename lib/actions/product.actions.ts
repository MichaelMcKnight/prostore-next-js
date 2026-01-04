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

  const normalized = data.map((p) => ({
    ...p,
    price: p.price.toString(), // Decimal -> string
    rating: p.rating.toString(), // Decimal -> string
  }));

  return convertToPlainObject(normalized);
}

// Get single product by slug
export async function getProductABySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
