"use client";
import { useForm } from "@tanstack/react-form";
import { AuthComponent } from "../../../components/AuthComponent";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import Input from "../../../components/Input";
import axios from "axios";
import { HTTP_URL } from "../../../utils/import";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setLoading(true);
        const response = await axios.post(`${HTTP_URL}/auth/signup`, {
          username: value.username,
          password: value.password,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          router.push("/signin");
        } else {
          toast.error(response.data.errorMessage);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div >
      <AuthComponent mode="signup">
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="username"
            children={(field) => {
              return (
                <Input
                  value={field.state.value}
                  label="Username"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter username"
                  type="text"
                />
              );
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              return (
                <label className="block text-xs font-semibold">
                  Password
                  <div className="relative mt-2">
                    <input
                      value={field.state.value}
                      required
                      minLength={8}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="h-11 w-full rounded-lg border-2 border-border bg-background px-3 pr-11 text-sm outline-none transition focus:border-primary"
                      placeholder="8 characters minimum"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
              );
            }}
          />

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-blue-700 bg-primary text-sm font-semibold text-white shadow-[0_4px_0_#183d96] transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <p className="flex gap-2">
                Create account
                <ArrowRight size={16} />
              </p>
            )}
          </button>
        </form>
      </AuthComponent>
    </div>
  );
};

export default Signup;
