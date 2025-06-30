"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Loader2 } from "lucide-react";

import { useRegisterModal } from "@/hooks/use-register-modal";
import { useAuthStore } from "@/store/auth-store";
import { registerStepOneSchema } from "../../validation/index";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Step1Values = z.infer<typeof registerStepOneSchema>;

export const Step1Details = () => {
  const { nextStep } = useRegisterModal();
  const { setFullName, setEmail, fullName, email } = useAuthStore();

  const form = useForm<Step1Values>({
    resolver: zodResolver(registerStepOneSchema),
    defaultValues: {
      fullName: fullName || "",
      email: email || "",
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: Step1Values) => {
    setFullName(values.fullName);
    setEmail(values.email);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        {/* Full Name Input */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    className="pl-10 h-12 text-base"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </div>
              <FormMessage className="pl-1" />
            </FormItem>
          )}
        />

        {/* Email Input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-12 text-base"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </div>
              <FormMessage className="pl-1" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            "Send Verification Code"
          )}
        </Button>
      </form>
    </Form>
  );
};