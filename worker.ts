import handler from "vinext/server/fetch-handler";

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const response = await handler.fetch(request, env, ctx);
    const pathname = new URL(request.url).pathname;

    // Cloudflare occasionally omits the MIME type on shared vinext chunks.
    // Browsers then refuse to hydrate the page, leaving interactive sections
    // such as checkout and the language picker in their loading state.
    if (pathname.endsWith(".js")) {
      const headers = new Headers(response.headers);
      headers.set("content-type", "text/javascript; charset=utf-8");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    if (response.headers.get("content-type")?.includes("text/html")) {
      const headers = new Headers(response.headers);
      headers.delete("content-length");
      const html = (await response.text()).replace(
        /(<script[^>]+src=")(\/_next\/static\/chunks\/[^"?]+\.js)(")/g,
        "$1$2?v=20261007$3",
      );
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
