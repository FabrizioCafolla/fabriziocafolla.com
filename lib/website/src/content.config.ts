import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    tags: z.array(z.string().max(24)).min(1).max(10).optional(),
    publishDate: z.date().optional(),
    readingTime: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ base: "./src/content/guides", pattern: "**/*.{yaml,yml}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    aliases: z.array(z.string()).optional(),
    description: z.string().optional(),
    tips: z.string().optional(),
    places: z.array(
      z.object({
        name: z.string(),
        cost: z.enum(["low", "mid-low", "middle", "mid-high", "high"]).optional(),
        maps: z.url().optional(),
        notes: z.string().optional(),
        hours: z.array(z.string()).optional(),
        type: z.array(z.string()),
        tags: z.array(z.string()).optional(),
        rating: z.enum(["good", "recommended", "top", "unique"]),
      })
    ),
  }),
});

const photos = defineCollection({
  loader: glob({ base: "./src/content/photos", pattern: "**/*.{yaml,yml}" }),
  schema: z.object({
    photos: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        location: z.string(),
        date: z.string(),
        path: z.string(),
      })
    ),
  }),
});

export const collections = { posts, guides, photos };
