
"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ResponseTypeSelector() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="response_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Response Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a response type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="not_interested">Not Interested</SelectItem>
              <SelectItem value="need_more_info">Need More Info</SelectItem>
              <SelectItem value="contact_requested">Contact Requested</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
