import { NextResponse } from "next/server";
import { getFileBySlug } from "@/lib/file-reader";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log(`[API] GET /api/files/${slug} - Fetching file content`);

    if (!slug) {
      console.log('[API] Error: File slug is required');
      return NextResponse.json(
        { error: "File slug is required" },
        { status: 400 }
      );
    }

    const file = await getFileBySlug(slug);
    console.log(`[API] File found: ${!!file}`);

    if (!file) {
      console.log(`[API] Error: File not found for slug: ${slug}`);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    console.log(`[API] Returning file: ${file.title} (${file.content.length} chars)`);
    return NextResponse.json({ file });
  } catch (error) {
    console.error("Error fetching file content:", error);
    return NextResponse.json(
      { error: "Failed to fetch file content" },
      { status: 500 }
    );
  }
}
