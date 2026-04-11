import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";
import type { ReactNode } from "react";

interface FormProviderProps<T extends Record<string, unknown>> {
  schema: ZodSchema<T>;
  defaultValues: T;
  children: (methods: ReturnType<typeof useForm<T>>) => ReactNode;
  onSubmit: (values: T) => void | Promise<void>;
  className?: string;
}

export function FormProvider<T extends Record<string, unknown>>({
  schema,
  defaultValues,
  children,
  onSubmit,
  className,
}: FormProviderProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  return (
    <RHFProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children(methods)}
      </form>
    </RHFProvider>
  );
}

export { useForm };
