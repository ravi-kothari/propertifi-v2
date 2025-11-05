"use client";

import { getTestimonials } from "@/lib/api-client";
import { Testimonial } from "./Testimonial";
import { Grid } from "./layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api-client";
import type { Testimonial as TestimonialType } from "@/lib/types/api";

function TestimonialSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        setIsLoading(true);
        const response = await getTestimonials(3);
        setTestimonials(response.data);
        setError(null);
      } catch (error) {
        if (error instanceof ApiClientError) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  if (isLoading) {
    return (
      <Grid cols={3} gap="lg">
        <TestimonialSkeleton />
        <TestimonialSkeleton />
        <TestimonialSkeleton />
      </Grid>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
        Error loading testimonials: {error}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-slate-500 bg-slate-100 p-4 rounded-md">
        No testimonials available at the moment.
      </div>
    );
  }

  return (
    <Grid cols={3} gap="lg">
      {testimonials.map((testimonial) => (
        <Testimonial
          key={testimonial.id}
          quote={testimonial.quote}
          author={testimonial.name}
          rating={testimonial.rating}
          avatar={testimonial.image_url}
        />
      ))}
    </Grid>
  );
}