import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const B2_BUCKET_URL =
  process.env.B2_BUCKET_PUBLIC_URL ?? "https://s3.us-east-005.backblazeb2.com/tcsolutionsapp";
const FALLBACK_IMAGE_FILE = "hero-cleaning.png";

async function fallbackImageResponse() {
  try {
    const imagePath = join(process.cwd(), "public", FALLBACK_IMAGE_FILE);
    const imageBuffer = await readFile(imagePath);
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Fallback image not found.", { status: 404 });
  }
}

export async function GET(request: NextRequest) {
  const filePath = request.nextUrl.searchParams.get("path");

  if (!filePath) {
    return new Response("Missing 'path' query parameter.", { status: 400 });
  }

  if (filePath.includes("..")) {
    return new Response("Invalid path.", { status: 400 });
  }

  const normalizedPath = filePath.replace(/^\/+/, "");
  const upstreamUrl = `${B2_BUCKET_URL}/${normalizedPath}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Accept: "image/*,*/*;q=0.8" },
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return fallbackImageResponse();
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return fallbackImageResponse();
  }
}
