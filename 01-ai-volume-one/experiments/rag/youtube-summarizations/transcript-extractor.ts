// Fetch the transcript using yt-dlp
export async function fetchTranscriptWithYtDlp(
  videoId: string,
): Promise<string> {
  try {
    console.log("Fetching transcript with yt-dlp...");

    // Create a temporary file to store the transcript
    const tempFile = await Deno.makeTempFile({ suffix: ".vtt" });

    // Use yt-dlp to download only the subtitles/transcript
    const process = new Deno.Command("yt-dlp", {
      args: [
        "--skip-download",
        "--write-auto-sub",
        "--sub-format",
        "vtt",
        "--sub-lang",
        "en",
        "-o",
        tempFile.replace(/\.vtt$/, ""),
        `https://www.youtube.com/watch?v=${videoId}`,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await process.output();

    if (output.code !== 0) {
      const errorOutput = new TextDecoder().decode(output.stderr);
      throw new Error(`yt-dlp failed: ${errorOutput}`);
    }

    // Read the downloaded transcript file
    let transcriptContent: string;
    try {
      transcriptContent = await Deno.readTextFile(
        `${tempFile.replace(/\.vtt$/, "")}.en.vtt`,
      );
    } catch (_error) {
      try {
        // Try alternative filename pattern
        transcriptContent = await Deno.readTextFile(
          `${tempFile.replace(/\.vtt$/, "")}.vtt`,
        );
      } catch (_error) {
        throw new Error("Could not find downloaded transcript file");
      }
    }

    // Clean up the VTT format to get plain text
    // Remove timing information and other VTT formatting
    const cleanedTranscript = transcriptContent
      .split("\n")
      .filter((line: string) =>
        !line.match(/^\d{2}:\d{2}:\d{2}\.\d{3}/) && // Remove timestamp lines
        !line.match(/^WEBVTT/) && // Remove WEBVTT header
        !line.match(/^\s*$/) && // Remove empty lines
        !line.match(/^NOTE/) // Remove NOTE lines
      )
      .join(" ")
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " "); // Normalize whitespace

    // Clean up temp files
    try {
      await Deno.remove(`${tempFile.replace(/\.vtt$/, "")}.en.vtt`);
    } catch (_error) {
      try {
        await Deno.remove(`${tempFile.replace(/\.vtt$/, "")}.vtt`);
      } catch (_error) {
        // Ignore cleanup errors
      }
    }

    return cleanedTranscript;
  } catch (error) {
    console.error("Error fetching transcript with yt-dlp:", error);
    return "Failed to extract transcript. Please install yt-dlp for best results.";
  }
}

// Function to fetch video title
export async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    console.log("Fetching video title...");

    // Try yt-dlp
    const process = new Deno.Command("yt-dlp", {
      args: [
        "--skip-download",
        "--print",
        "title",
        `https://www.youtube.com/watch?v=${videoId}`,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await process.output();
    if (output.code === 0) {
      const title = new TextDecoder().decode(output.stdout);
      return title.trim();
    }

    return "Unknown Title"; // Default if method fails
  } catch (error) {
    console.error("Error fetching video title:", error);
    return "Unknown Title";
  }
}
