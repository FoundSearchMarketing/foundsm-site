import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // A/B Test: Homepage Hero
  // Cookie name: ab-homepage-hero
  // Variants: 'control' | 'variant-a'

  const testCookie = context.cookies.get('ab-homepage-hero');
  let variant = testCookie?.value;

  if (!variant) {
    // Assign randomly: 50/50 split
    variant = Math.random() < 0.5 ? 'control' : 'variant-a';
    context.cookies.set('ab-homepage-hero', variant, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false, // Readable by GTM for analytics
      secure: true,
      sameSite: 'lax',
    });
  }

  // Make variant available to pages via locals
  context.locals.abTests = {
    'homepage-hero': variant,
  };

  const response = await next();
  return response;
});
