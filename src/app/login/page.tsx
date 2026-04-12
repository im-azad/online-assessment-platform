"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { mockUsers } from "@/mocks/data";
import { setCredentials } from "@/store/slices/authSlice";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginForm) => {
    // Mock auth: match by email only (password validated by Zod ≥6 chars)
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (foundUser) {
      dispatch(setCredentials({ user: foundUser, token: `mock-token-${foundUser.id}` }));
      toast.success("Login successful!");
      router.replace(foundUser.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    } else {
      toast.error("No account found with that email.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 h-full">
      <Card className="w-full max-w-md shadow-sm border-slate-200">
        <CardHeader className="space-y-1 pb-8 pt-8">
          <CardTitle className="text-2xl text-center font-bold text-slate-700">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-600">Email/ User ID</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email/User ID"
                className="py-6 rounded-xl border-slate-200"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-600">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="py-6 rounded-xl border-slate-200 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button type="button" className="text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                  Forget Password?
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-md shadow-md mt-6 transition-all"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Mock Login Access for testing */}
          <div className="mt-8 flex justify-center">
             <button
                type="button"
                onClick={() => {
                  form.setValue("email", "candidate@akij.work");
                  form.setValue("password", "password123");
                }}
                className="text-xs text-muted-foreground hover:underline"
              >
                Use Mock Candidate
              </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
