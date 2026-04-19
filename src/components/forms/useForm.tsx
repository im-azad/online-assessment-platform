"use client";

import * as React from "react";
import { useForm as useRHF, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TypeOf, ZodSchema } from "zod";

interface FormConfig<T extends ZodSchema> extends Omit<UseFormProps<TypeOf<T>>, "resolver"> {
  schema: T;
}

export function useForm<T extends ZodSchema>({
  schema,
  ...config
}: FormConfig<T>): UseFormReturn<TypeOf<T>> {
  return useRHF({
    resolver: zodResolver(schema),
    ...config,
  });
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
