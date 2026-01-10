import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Function to handle prisma errors deeper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prismaUniqueField(error: any): string | null {
  // Prisma v7 driver adapter path
  const cause = error?.meta?.driverAdapterError?.cause;

  // 1) Try constraint name -> e.g. "user_email_idx"
  const constraintName =
    cause?.constraint?.name ||
    cause?.constraint?.constraintName ||
    (typeof cause?.originalMessage === "string"
      ? cause.originalMessage.match(/unique constraint "([^"]+)"/)?.[1] ?? null
      : null);

  if (typeof constraintName === "string") {
    // pull "email" out of "user_email_idx"
    const m = constraintName.match(/_([a-zA-Z0-9]+)_(?:idx|key)$/);
    if (m?.[1]) return m[1];
  }

  // 2) Fallback: parse prisma message itself
  const prismaMsg = typeof error?.message === "string" ? error.message : "";
  const prismaMatch = prismaMsg.match(/fields:\s*\(`([^`]+)`\)/);
  if (prismaMatch?.[1]) return prismaMatch[1];

  return null;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error instanceof ZodError) {
    const { fieldErrors } = error.flatten();

    return Object.values(fieldErrors).flat().join(", ");
  } else if (
    typeof error === "object" &&
    error !== null &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).code === "P2002"
  ) {
    const field = prismaUniqueField(error) ?? "email"; // sensible default for signup
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
