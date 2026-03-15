import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    pubDate: z.coerce.date(),
    author: z.string()
  })
});

const reports = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string().optional(),
    blocks: z.array(z.object({
      type: z.string()
    }).passthrough())
  })
});

export const collections = { blog, reports };
