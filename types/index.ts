import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string; // or Prisma.Decimal in DB layer
  createdAt: Date;
};
