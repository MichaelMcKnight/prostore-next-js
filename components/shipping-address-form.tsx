"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { updateUserAddress } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader } from "lucide-react";

const FORM_ID = "shipping-address-form";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof shippingAddressSchema>) {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push("/payment-method");
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="h2-bold mt-4">Shipping Address</h1>
      <p className="text-sm text-muted-foreground">
        Please enter your shipping address details.
      </p>

      <form
        id={FORM_ID}
        noValidate
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${FORM_ID}-fullName`}>
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id={`${FORM_ID}-fullName`}
                  placeholder="Enter full name"
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="streetAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${FORM_ID}-streetAddress`}>
                  Address
                </FieldLabel>
                <Input
                  {...field}
                  id={`${FORM_ID}-streetAddress`}
                  placeholder="Enter address"
                  aria-invalid={fieldState.invalid}
                  autoComplete="street-address"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${FORM_ID}-city`}>City</FieldLabel>
                <Input
                  {...field}
                  id={`${FORM_ID}-city`}
                  placeholder="Enter city"
                  aria-invalid={fieldState.invalid}
                  autoComplete="address-level2"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${FORM_ID}-postalCode`}>
                  Postal Code
                </FieldLabel>
                <Input
                  {...field}
                  id={`${FORM_ID}-postalCode`}
                  placeholder="Enter postal code"
                  aria-invalid={fieldState.invalid}
                  autoComplete="postal-code"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${FORM_ID}-country`}>Country</FieldLabel>
                <Input
                  {...field}
                  id={`${FORM_ID}-country`}
                  placeholder="Enter country"
                  aria-invalid={fieldState.invalid}
                  autoComplete="country-name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            Continue
            {isPending ? (
              <Loader className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressForm;
