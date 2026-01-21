"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Cart } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20">
          <p className="mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/">
              <span>Go to Shop</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <span>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        size="icon"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            const result = await removeItemFromCart(
                              item.productId,
                            );
                            if (result.success) {
                              toast.success("Item removed from cart");
                              router.refresh();
                            } else {
                              toast.error(
                                result.message || "Failed to remove item",
                              );
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        size="icon"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            const result = await addItemToCart(item);
                            if (result.success) {
                              toast.success("Item added to cart");
                              router.refresh();
                            } else {
                              toast.error(
                                result.message || "Failed to add item",
                              );
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      ${(Number(item.price) * item.qty).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal: ({cart.items.reduce((acc, item) => acc + item.qty, 0)}
                ):{" "}
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => {
                  startTransition(() => router.push("/shipping-address"));
                }}
              >
                Proceed to Checkout
                {isPending ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}{" "}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
