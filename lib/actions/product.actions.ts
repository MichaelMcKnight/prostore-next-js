"use server";
import { prisma } from "@/db/client";
import "dotenv/config";
import { serializePrisma } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return serializePrisma(data);
}

// Get single product by slug
export async function getProductABySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug: slug },
  });

  return serializePrisma(product);
}
