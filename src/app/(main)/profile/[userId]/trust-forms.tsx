"use client";

import { useForm } from "react-hook-form";
import { TrustFormData, trustFormSchema } from "./trust-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteTrustAction, updateTrustAction } from "./trust-actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  trustTarget: string;
  startingPercent?: number;
}

export default function TrustForm({ trustTarget, startingPercent }: Props) {
  const form = useForm<TrustFormData>({
    resolver: zodResolver(trustFormSchema),
    defaultValues: {
      trustTarget: trustTarget,
      trustAmount: startingPercent,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateTrustAction(data);
  });

  console.log("trustTarget", trustTarget);
  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="trustAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trust Percent</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit">Update</Button>
            <Button type="button" variant={"destructive"} onClick={() => deleteTrustAction(trustTarget)}>
              Delete
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export function TrustCreateForm({ trustTarget, startingPercent }: Props) {
  const form = useForm<TrustFormData>({
    resolver: zodResolver(trustFormSchema),
    defaultValues: {
      trustTarget: trustTarget,
      trustAmount: startingPercent,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateTrustAction(data);
  });
  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="trustAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trust Percent</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Trust</Button>
        </form>
      </Form>
    </>
  );
}
