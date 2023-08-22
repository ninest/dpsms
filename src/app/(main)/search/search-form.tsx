"use client";

import { searchLocationAction } from "@/app/(main)/search/search-actions";
import { type SearchFormData, searchFormSchema, qualifiers } from "@/app/(main)/search/search-schemas";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  defaultAddress: string;
}

export function SearchForm({ defaultAddress }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: defaultAddress,
      qualifiers: (searchParams.getAll("qualifier") ?? []) as SearchFormData["qualifiers"],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const queryParams = new URLSearchParams({
        location: data.location,
      });
      data.qualifiers.forEach((q) => queryParams.append("qualifier", q));

      // Convert the array of qualifiers into a comma-separated string
      // const qualifiersString = data.qualifiers.join(",");
      // Add the qualifiers string to the query parameters
      // queryParams.append("qualifiers", qualifiersString);

      router.push(`/search?${queryParams}`);
    } catch (error) {
      // Handle error here
      console.error("An error occurred:", error);
    }
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Location</FormLabel>
                <FormControl>
                  <Input {...field} />
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

          <Button>Search</Button>
        </form>
      </Form>
    </div>
  );
}
