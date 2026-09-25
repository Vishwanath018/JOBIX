import { NextRequest, NextResponse } from "next/server";

const QUERY = `
query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    title
    content
  }
}
`;

function extractImages(html: string) {
  const images = new Set<string>();

  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+data-src=["']([^"']+)["']/gi,
    /https?:\/\/assets\.leetcode\.com\/[^"'\\\s<>]+/gi,
  ];

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.exec(html)) !== null) {
      let url = match[1] || match[0];

      url = url
        .replace(/&amp;/g, "&")
        .replace(/\\u0026/g, "&")
        .replace(/\\\//g, "/");

      if (url.startsWith("//")) {
        url = `https:${url}`;
      }

      if (url.startsWith("/")) {
        url = `https://leetcode.com${url}`;
      }

      if (
        url.startsWith("https://assets.leetcode.com/") ||
        url.startsWith("https://leetcode.com/")
      ) {
        images.add(url);
      }
    }
  }

  return Array.from(images);
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { images: [] },
      { status: 400 }
    );
  }

  try {
    const graphqlResponse = await fetch(
      "https://leetcode.com/graphql/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://leetcode.com",
          Referer: `https://leetcode.com/problems/${slug}/`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36",
        },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            titleSlug: slug,
          },
        }),
        cache: "no-store",
      }
    );

    let images: string[] = [];

    if (graphqlResponse.ok) {
      const data = await graphqlResponse.json();
      const content = data?.data?.question?.content || "";

      images = extractImages(content);
    }

    if (images.length === 0) {
      const pageResponse = await fetch(
        `https://leetcode.com/problems/${slug}/description/`,
        {
          headers: {
            Accept:
              "text/html,application/xhtml+xml",
            Referer: "https://leetcode.com/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142 Safari/537.36",
          },
          cache: "no-store",
        }
      );

      if (pageResponse.ok) {
        const html = await pageResponse.text();
        images = extractImages(html);
      }
    }

    return NextResponse.json(
      {
        slug,
        images,
        count: images.length,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch {
    return NextResponse.json({
      slug,
      images: [],
      count: 0,
    });
  }
}
