
"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function PriceQuoteForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="price_quote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price Quote ($)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 2500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
