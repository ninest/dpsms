"use client";

import { requestTenancyAction } from "@/app/(main)/tenant-actions";
import { TenantRequestForm, tenantRequestFormSchema } from "@/app/(main)/hosts/[hostListingId]/tenant-schemas";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toHtmlInputDate } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  hostListingId: string;
  suggestions: null | { id: string; itemsDescription: string; sqft: number }[];
}

export function TenantForm({ hostListingId, suggestions }: Props) {
  const form = useForm<TenantRequestForm>({
    resolver: zodResolver(tenantRequestFormSchema),
    defaultValues: {
      tenancyRequestId: undefined,
      itemsDescription: "",
      startTime: new Date(),
      endTime: new Date(),
      sqft: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await requestTenancyAction(hostListingId, data);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  });

  const autofill = (suggestionId: string) => {
    const suggestion = suggestions?.find((suggestion) => suggestion.id === suggestionId);
    if (!suggestion) return;
    form.setValue("tenancyRequestId", suggestion.id);
    form.setValue("itemsDescription", suggestion.itemsDescription);
    form.setValue("sqft", suggestion.sqft);
  };

  useEffect(() => {
    const tenancyRequestId = form.getValues("tenancyRequestId");
    if (!tenancyRequestId) return;

    autofill(tenancyRequestId);
  }, [form.watch("tenancyRequestId")]);

  const suggestionSelected = !!form.watch("tenancyRequestId");

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          {!!suggestions?.length && (
            <>
              <FormField
                control={form.control}
                name="tenancyRequestId"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Previous request</FormLabel>
                      <FormDescription>Select previous information to autofill.</FormDescription>
                    </div>

                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {suggestions.map((suggestion) => (
                          <FormItem key={suggestion.id} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={suggestion.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {suggestion.itemsDescription} - {suggestion.sqft}sqft
                            </FormLabel>
                          </FormItem>
                        ))}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            {/* @ts-ignore */}
                            <RadioGroupItem value={undefined} />
                          </FormControl>
                          <FormLabel className="font-normal">None</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="itemsDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Items description</FormLabel>
                <FormControl>
                  <Textarea disabled={suggestionSelected} placeholder="Large couch, small TV, ..." {...field} />
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
                  <Input disabled={suggestionSelected} placeholder="1000" type="number" {...field} />
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
            name="endTime"
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
          <Button>Request tenancy</Button>
        </form>
      </Form>
    </>
  );
}
