import { NextResponse } from "next/server";
import { getLibraryFiles, getResourceFiles } from "@/lib/file-reader";

export async function GET(request: Request) {
  try {
    // Get the URL and parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    console.log(`[API] GET /api/files - Fetching files with type: ${type || 'all'}`);

    let files;

    // If type is specified, filter by type
    if (type === 'resource') {
      console.log('[API] Getting resource files');
      files = await getResourceFiles();
    } else if (type) {
      console.log(`[API] Getting files of type: ${type}`);
      files = await getLibraryFiles(type);
    } else {
      console.log('[API] Getting all library files');
      // Otherwise, get all files
      files = await getLibraryFiles();
    }

    console.log(`[API] Found ${files.length} files`);
    if (files.length > 0) {
      console.log('[API] First file:', files[0]);
    }

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
