import { NextRequest, NextResponse } from "next/server";

// Proxies the image and forces download via Content-Disposition.
// Works even when the image is hosted cross-origin where <a download> is ignored.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");
  const filenameParam = searchParams.get("filename");

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Fetch image from remote source
  const upstream = await fetch(url);
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 502 }
    );
  }

  const arrayBuffer = await upstream.arrayBuffer();

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const extFromType = contentType.includes("jpeg")
    ? "jpg"
    : contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : contentType.includes("gif")
          ? "gif"
          : "bin";

  const safeBase = (filenameParam || "gallery-image")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const filename = `${safeBase || "gallery-image"}.${extFromType}`;

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      // Avoid caching issues when URLs are signed/temporary
      "Cache-Control": "no-store",
    },
  });
}
