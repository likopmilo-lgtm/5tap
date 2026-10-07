import handler from "vinext/server/fetch-handler";

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const response = await handler.fetch(request, env, ctx);
    const pathname = new URL(request.url).pathname;
    const extension = pathname.slice(pathname.lastIndexOf(".")).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".ico": "image/x-icon",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
    };

    // Cloudflare can return vinext assets as text/plain. Safari refuses those
    // styles, images and modules, so normalize every browser asset response.
    if (mimeTypes[extension]) {
      const headers = new Headers(response.headers);
      headers.set("content-type", mimeTypes[extension]);
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
        /((?:src|href)=")(\/[^"?]+\.(?:css|js|png|jpe?g|webp|gif|svg|ico|woff2?))(")/gi,
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
