import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Simply pass through in development to avoid header issues
  return await next();
});