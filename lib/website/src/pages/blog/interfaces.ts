import type { CollectionEntry } from "astro:content";

export type PostsEntry = CollectionEntry<"posts">;

export interface Posts {
  title: string;
  description: string;
  slug?: string;
  tags?: string[];
  publishDate?: Date;
  author?: string;
}
