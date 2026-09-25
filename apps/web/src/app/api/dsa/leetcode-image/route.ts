import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing image URL", {
      status: 400,
    });
  }

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname !== "assets.leetcode.com" &&
      parsed.hostname !== "leetcode.com"
    ) {
      return new NextResponse("Invalid image host", {
        status: 403,
      });
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        Referer: "https://leetcode.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Image unavailable", {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get("content-type") ||
      "image/png";

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Unable to load image", {
      status: 500,
    });
  }
}
