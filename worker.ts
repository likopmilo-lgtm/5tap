import handler from "vinext/server/fetch-handler";

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const response = await handler.fetch(request, env, ctx);
    const pathname = new URL(request.url).pathname;

    // Cloudflare occasionally omits the MIME type on shared vinext chunks.
    // Browsers then refuse to hydrate the page, leaving interactive sections
    // such as checkout and the language picker in their loading state.
    if (pathname.endsWith(".js") && !response.headers.get("content-type")) {
      const headers = new Headers(response.headers);
      headers.set("content-type", "text/javascript; charset=utf-8");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
