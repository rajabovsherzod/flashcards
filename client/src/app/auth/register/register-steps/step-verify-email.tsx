"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterModal } from "@/hooks/use-register-modal";
import { useAuthStore } from "@/store/auth-store";
import { registerStepTwoSchema } from "../../validation/index";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

type Step2Values = z.infer<typeof registerStepTwoSchema>;

export const Step2Verify = () => {
  const { nextStep } = useRegisterModal();
  const { email } = useAuthStore();

  const form = useForm<Step2Values>({
    resolver: zodResolver(registerStepTwoSchema),
    defaultValues: { verifyCode: "" },
  });

  const onSubmit = (values: Step2Values) => {
    // Backendga ulashda bu yerga useMutation logikasi keladi
    console.log("Verifying code:", values.verifyCode);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-2">
        <div className="text-center">
            <h3 className="text-lg font-semibold tracking-tight">Enter Verification Code</h3>
            <p className="text-sm text-muted-foreground mt-2">
                We&apos;ve sent a 6-digit code to your email <br/>
                <span className="font-medium text-foreground">{email}</span>
            </p>
        </div>

        <FormField
          control={form.control}
          name="verifyCode"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot className="h-14 w-12 text-2xl border-2 rounded-md" index={0} />
                    <InputOTPSlot className="h-14 w-12 text-2xl border-2 rounded-md" index={1} />
                    <InputOTPSlot className="h-14 w-12 text-2xl border-2 rounded-md" index={2} />
                    <InputOTPSlot className="h-14 w-12 text-2xl border-2 rounded-md" index={3} />
                    <InputOTPSlot className="h-14 w-12 text-2xl border-2 rounded-md" index={4} />
                    <InputOTPSlot className="h-14 w-12 text-2xl border-2 rounded-md" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-base">
           Verify
        </Button>
      </form>
    </Form>
  );
};