export const prerender = false;

const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;
const SECRET = import.meta.env.SECRET;

export const POST = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { action, postId, secret } = body;

    if (!action || !postId || !secret) {
      return new Response(
        JSON.stringify({ error: "Missing action, postId, or secret" }),
        { status: 400 }
      );
    }

    if (secret !== SECRET) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 401,
      });
    }

    let endpoint = "";
    switch (action) {
      case "publish":
        endpoint = `${STRAPI_URL}/api/posts/${postId}/publish`;
        break;
      case "unpublish":
        endpoint = `${STRAPI_URL}/api/posts/${postId}/unpublish`;
        break;
      case "discard":
        endpoint = `${STRAPI_URL}/api/posts/${postId}/discard`;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
        });
    }

    try {
      const strapiResponse = await fetch(endpoint, {
        method: action === "discard" ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!strapiResponse.ok) {
        throw new Error(`Strapi API error: ${strapiResponse.statusText}`);
      }

      const data = await strapiResponse.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error("Error calling Strapi API:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Invalid content type" }), {
    status: 400,
  });
};
