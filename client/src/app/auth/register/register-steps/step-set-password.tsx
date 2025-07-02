"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useRegisterModal } from "@/hooks/use-register-modal";
import { registerStepThreeSchema } from "../../validation/index";
import { registerStepThree } from "@/lib/api/auth/auth";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Step3Values = z.infer<typeof registerStepThreeSchema>;

export const Step3Password = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { onClose } = useRegisterModal();
  const { email, setUserData } = useAuthStore();
  const router = useRouter();
  const form = useForm<Step3Values>({
    resolver: zodResolver(registerStepThreeSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const { mutate: registerStepThreeMutate, isPending } = useMutation({
    mutationKey: ["register-step-three"],
    mutationFn: registerStepThree,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.data.accessToken);
      setUserData({
        fullName: data.data.fullName || "",
        email: data.data.email || email,
      });

      toast.success("Account created successfully");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 0);
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create account", { description: error.message });
    },
  });

  const onSubmit = (values: Step3Values) => {
    registerStepThreeMutate({
      email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        {/* Password Input */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage className="pl-1" />
            </FormItem>
          )}
        />

        {/* Confirm Password Input */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="pl-10 pr-10 h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage className="pl-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
};
