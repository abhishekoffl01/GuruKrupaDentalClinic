/**
 * Image processing and compression utilities
 * Produces crisp, lightweight data URLs for smooth preview and fast local storage.
 */

export async function compressImageFile(file: File, maxDimension = 1280, quality = 0.80): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic file type check
    if (!file.type.startsWith('image/')) {
      // Still attempt to read as dataURL
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Empty file result'));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to original data URL if image decoding fails in canvas
        resolve(dataUrl);
      };
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          // Retain clean rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Use image/jpeg for photos, image/png if transparency needed
          const outputType = file.type === 'image/png' && file.size < 500000 ? 'image/png' : 'image/jpeg';
          const compressed = canvas.toDataURL(outputType, quality);
          resolve(compressed);
        } catch (err) {
          // If canvas fails (e.g. security origin or dimension issue), return raw dataUrl
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Format a filename to a human-friendly title
 */
export function formatImageTitle(fileName: string, fallback = 'Clinic Photo'): string {
  if (!fileName) return fallback;
  const clean = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (!clean) return fallback;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
