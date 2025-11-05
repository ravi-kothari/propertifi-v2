"use client";

import { getLatestBlogPosts } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "./layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api-client";
import type { BlogPost } from "@/lib/types/api";
import Image from 'next/image';
import Link from 'next/link';

function PostSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[175px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function LatestPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatestPosts() {
      try {
        setIsLoading(true);
        const response = await getLatestBlogPosts(3);
        setPosts(response.data);
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
    loadLatestPosts();
  }, []);

  if (isLoading) {
    return (
      <Grid cols={3} gap="lg">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </Grid>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
        Error loading blog posts: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-slate-500 bg-slate-100 p-4 rounded-md">
        No recent blog posts available.
      </div>
    );
  }

  return (
    <Grid cols={3} gap="lg">
      {posts.map((post) => (
        <Card key={post.id}>
          <Link href={`/blog/${post.slug}`}>
            <Image 
              src={post.featured_image_url || '/images/placeholder.png'}
              alt={post.title}
              width={400}
              height={250}
              className="rounded-t-lg object-cover w-full h-48"
            />
          </Link>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{post.excerpt}</CardDescription>
            <Link href={`/blog/${post.slug}`} className="text-primary-600 hover:underline mt-4 inline-block">
              Read More
            </Link>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}