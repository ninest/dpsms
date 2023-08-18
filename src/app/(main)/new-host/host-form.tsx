"use client";

import { createHostListingAction } from "@/app/(main)/host-actions";
import { HostForm, hostFormSchema, qualifiers } from "@/app/(main)/new-host/host-schemas";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  defaultAddress: string;
}

export function HostForm({ defaultAddress }: Props) {
  const form = useForm<HostForm>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: {
      timings: "",
      sqft: 0,
      qualifiers: [],
      sizeDescription: "",
      image: "",
      address: defaultAddress,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await createHostListingAction(data);
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timings</FormLabel>
                <FormControl>
                  <Textarea placeholder="11 AM to 1 PM Mondays to Fridays ..." {...field} />
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
            name="qualifiers"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Qualifiers</FormLabel>
                  <FormDescription>Select all qualifiers you need.</FormDescription>
                </div>
                {qualifiers.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="qualifiers"
                    render={({ field }) => {
                      return (
                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(field.value?.filter((value) => value !== item));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sizeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormDescription>Enter a URL to an image</FormDescription>
                <FormControl>
                  <Input placeholder="https://image.com/image.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Submit</Button>
        </form>
      </Form>
    </>
  );
}
