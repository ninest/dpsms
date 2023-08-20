"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginForm, loginFormSchema } from "../../auth-schemas";
import { useSignIn } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { loginAction } from "../../auth-actions";

export default function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);
    try {
      const result = await signIn?.create({
        identifier: data.email,
        password: data.password,
      });
      console.log(result);
      if (result?.status === "complete" && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        await loginAction();
      } else {
        console.error(result);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.errors?.[0]?.longMessage ?? error.message);
    }
  });

  if (!isLoaded) return null;

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="tim@apple.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error in sign up</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Button>Login</Button>
        </form>
      </Form>
    </>
  );
}
