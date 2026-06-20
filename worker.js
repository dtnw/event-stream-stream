// Minimal Cloudflare Worker entry point.
// Delegates all requests to the static assets binding, which serves
// the Vite-built SPA from dist/ and falls back to index.html for
// unmatched routes (required for client-side TanStack Router).
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
