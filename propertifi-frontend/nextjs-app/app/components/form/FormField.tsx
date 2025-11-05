"use client";

import { useFormContext } from "react-hook-form";
import { Input, InputProps } from "@/app/components/ui/Input";

interface FormFieldProps extends InputProps {
  name: string;
}

export function FormField({ name, ...props }: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <Input
      {...props}
      {...register(name)}
      errorMessage={error}
    />
  );
}
