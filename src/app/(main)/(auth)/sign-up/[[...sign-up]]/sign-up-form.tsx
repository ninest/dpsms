"use client";

import { AuthForm, authFormSchema } from "@/app/(main)/(auth)/auth-schemas";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { finishSignUpAction } from "../../auth-actions";

export function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [verifying, setVerifying] = useState(false);
  const form = useForm<AuthForm>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
      verificationCode: "000000",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);
    if (!verifying) {
      try {
        const result = await signUp?.create({
          emailAddress: data.email,
          password: data.password,
        });
        await result?.prepareEmailAddressVerification();
        if (result?.status === "complete" && result.createdSessionId) {
          await setActive?.({ session: result.createdSessionId });
        }
        setVerifying(true);
        form.setValue("verificationCode", "");
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error.errors?.[0]?.longMessage ?? error.message);
      }
    } else {
      try {
        const result = await signUp?.attemptEmailAddressVerification({
          code: data.verificationCode,
        });
        console.log(result);
        if (result?.status === "complete" && result.createdSessionId) {
          await setActive?.({ session: result.createdSessionId });
          await finishSignUpAction();
        }
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error.errors?.[0]?.longMessage ?? error.message);
      }
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
                  <Input placeholder="tim@apple.com" type="email" disabled={verifying} {...field} />
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
                  <Input type="password" disabled={verifying} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {verifying && (
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error in sign up</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Button>{verifying ? "Verify" : "Create my account"}</Button>
        </form>
      </Form>
    </>
  );
}
