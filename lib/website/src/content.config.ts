import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

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

const placeSchema = z.object({
  name: z.string(),
  cost: z.enum(["basso", "medio-basso", "medio", "medio-alto", "alto"]),
  maps: z.string().url().optional(),
  notes: z.string().optional(),
  hours: z.array(z.string()).optional(),
  type: z.array(z.string()).min(1),
  rating: z.enum(["ok", "consigliato", "consigliatissimo", "caratteristico"]),
});

const guides = defineCollection({
  loader: glob({ base: "./src/content/guides", pattern: "**/*.{yaml,yml}" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    aliases: z.array(z.string()).optional(),
    description: z.string().optional(),
    places: z.array(placeSchema),
  }),
});

export const collections = { posts, guides };
