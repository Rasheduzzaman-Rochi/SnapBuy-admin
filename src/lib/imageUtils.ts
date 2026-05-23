export function extractGoogleDriveFileId(url?: string | null): string | null {
  if (!url) return null;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  const filePathMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (filePathMatch?.[1]) {
    return filePathMatch[1];
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.hostname !== 'drive.google.com') {
      return null;
    }

    if (
      parsedUrl.pathname === '/open' ||
      parsedUrl.pathname === '/uc' ||
      parsedUrl.pathname === '/thumbnail'
    ) {
      return parsedUrl.searchParams.get('id');
    }
  } catch {
    return null;
  }

  return null;
}

export function getImageCandidates(imageUrl?: string | null): string[] {
  if (!imageUrl) return [];

  const trimmedUrl = imageUrl.trim();
  if (!trimmedUrl) return [];

  const googleDriveFileId = extractGoogleDriveFileId(trimmedUrl);

  if (googleDriveFileId) {
    return [
      `https://drive.google.com/thumbnail?id=${googleDriveFileId}&sz=w1000`,
      `https://drive.google.com/uc?export=view&id=${googleDriveFileId}`,
      `https://lh3.googleusercontent.com/d/${googleDriveFileId}=w1000`,
    ];
  }

  return [trimmedUrl];
}
