
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitResponse } from "@/hooks/useLeads";
import { ResponseTypeSelector } from "./ResponseTypeSelector";
import { ContactInfoForm } from "./ContactInfoForm";
import { AvailabilityScheduler } from "./AvailabilityScheduler";
import { PriceQuoteForm } from "./PriceQuoteForm";

const formSchema = z.object({
  response_type: z.enum(["interested", "not_interested", "need_more_info", "contact_requested"]),
  message: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  availability_date: z.string().optional(),
  availability_time: z.string().optional(),
  price_quote: z.number().optional(),
});

export function ResponseForm({ leadId }: { leadId: string }) {
  const submitResponse = useSubmitResponse();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const responseType = form.watch("response_type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResponse.mutate({ leadId: parseInt(leadId, 10), data: values as any });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ResponseTypeSelector />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="(Optional) Add a message..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {responseType === 'interested' && <PriceQuoteForm />}
        {responseType === 'contact_requested' && (
          <>
            <ContactInfoForm />
            <AvailabilityScheduler />
          </>
        )}

        <Button type="submit" disabled={submitResponse.isPending}>
          {submitResponse.isPending ? "Submitting..." : "Submit Response"}
        </Button>
        {submitResponse.isError && <p className="text-red-500">Error submitting response.</p>}
        {submitResponse.isSuccess && <p className="text-green-500">Response submitted successfully.</p>}
      </form>
    </Form>
  );
}
