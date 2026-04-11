"use client";

import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";

export function FormProvider({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    mode: "onBlur",
  });

  return (
    <Form {...methods}>
      <form className="space-y-4">{children}</form>
    </Form>
  );
}

export { FormProvider as default };

export { useForm };
export { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription };
