"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useLoginModal } from "@/hooks/use-login-modal";
import { loginSchema } from "../validation/index";
import { login } from "@/lib/api/auth/auth";
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
import { useAuthStore } from "@/store/auth-store";

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { onClose } = useLoginModal();
  const { setAuthData } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationKey: ["login-mutate"],
    mutationFn: login,
    onSuccess: (data) => {
      const { accessToken, fullName, email } = data.data;

      setAuthData(accessToken, { fullName, email });

      router.replace("/decks", { scroll: false });
      toast.success("Login successful");

      onClose();
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (error) => {
      toast.error("Login failed", { description: error.message });
    },
  });

  const onSubmit = (values: LoginValues) => {
    loginMutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
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
                    disabled={isPending}
                  />
                </FormControl>
              </div>
              <FormMessage className="pl-1" />
            </FormItem>
          )}
        />

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
                    disabled={isPending}
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

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};
