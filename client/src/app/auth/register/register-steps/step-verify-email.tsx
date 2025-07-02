"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { useRegisterModal } from "@/hooks/use-register-modal";
import { useAuthStore } from "@/store/auth-store";
import { registerStepTwoSchema } from "../../validation/index";
import { registerStepTwo } from "@/lib/api/auth/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Step2Values = z.infer<typeof registerStepTwoSchema>;

export const Step2Verify = () => {
  const { nextStep } = useRegisterModal();
  const { email } = useAuthStore();

  const form = useForm<Step2Values>({
    resolver: zodResolver(registerStepTwoSchema),
    defaultValues: { verificationCode: "" },
  });

  const { mutate: registerStepTwoMutate, isPending } = useMutation({
    mutationKey: ["register-step-two"],
    mutationFn: registerStepTwo,
    onSuccess: (data) => {
      console.log("🔵 API response onSuccess:", data);
      toast.success("Email verified successfully");
      nextStep();
    },
    onError: (error: unknown) => {
      console.log("🔴 Frontend error:", error);
      toast.error("Invalid verification code", {
        description: "Please check your email and try again",
      });
    },
  });

  const onSubmit = (values: Step2Values) => {
    console.log("�� Frontend yuborayotgan ma'lumotlar:", {
      email,
      verificationCode: values.verificationCode,
    });
    registerStepTwoMutate({
      email,
      verificationCode: values.verificationCode,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-2">
        <div className="text-center">
          <h3 className="text-lg font-semibold tracking-tight">
            Enter Verification Code
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            We&apos;ve sent a 6-digit code to your email <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      className="h-14 w-12 text-2xl border-2 rounded-md"
                      index={0}
                    />
                    <InputOTPSlot
                      className="h-14 w-12 text-2xl border-2 rounded-md"
                      index={1}
                    />
                    <InputOTPSlot
                      className="h-14 w-12 text-2xl border-2 rounded-md"
                      index={2}
                    />
                    <InputOTPSlot
                      className="h-14 w-12 text-2xl border-2 rounded-md"
                      index={3}
                    />
                    <InputOTPSlot
                      className="h-14 w-12 text-2xl border-2 rounded-md"
                      index={4}
                    />
                    <InputOTPSlot
                      className="h-14 w-12 text-2xl border-2 rounded-md"
                      index={5}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Verify"}
        </Button>
      </form>
    </Form>
  );
};
