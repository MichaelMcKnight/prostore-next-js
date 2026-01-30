"use client";

import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Place Order
          </>
        )}
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
