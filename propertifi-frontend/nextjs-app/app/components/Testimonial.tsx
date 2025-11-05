import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  quote: string;
  author: string;
  rating: number;
  avatar?: string;
}

export function Testimonial({ quote, author, rating, avatar }: TestimonialProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-slate-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <p className="text-lg font-medium mb-4">{quote}</p>
        <div className="flex items-center">
          {avatar && (
            <Image
              src={avatar}
              alt={author}
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
          )}
          <p className="text-slate-600">{author}</p>
        </div>
      </CardContent>
    </Card>
  );
}
