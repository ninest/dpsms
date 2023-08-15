"use client";

import { requestTenancyAction } from "@/app/(main)/hosts/[hostListingId]/tenant-actions";
import { TenantRequestForm, tenantRequestFormSchema } from "@/app/(main)/hosts/[hostListingId]/tenant-schemas";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toHtmlInputDate } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  hostListingId: string;
}

export function TenantForm({ hostListingId }: Props) {
  const form = useForm<TenantRequestForm>({
    resolver: zodResolver(tenantRequestFormSchema),
    defaultValues: {
      itemsDescription: "",
      duration: 0,
      startTime: new Date(),
      sqft: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await requestTenancyAction(hostListingId, data);
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="itemsDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Items description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Large couch, small TV, ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sqft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sqft)</FormLabel>
                <FormControl>
                  <Input placeholder="1000" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10"
                    type="datetime-local"
                    {...field}
                    value={toHtmlInputDate(field.value)}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Input placeholder="10" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Request tenancy</Button>
        </form>
      </Form>
    </>
  );
}
