const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.8;
const MAX_SIZE_MB = 2;

/**
 * Compresses an image file client-side before uploading.
 * Returns a new File with reduced size while maintaining acceptable quality.
 */
export async function compressImage(file: File): Promise<File> {
  // Skip non-image files or SVGs
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  // Skip if already small enough
  if (file.size <= MAX_SIZE_MB * 1024 * 1024) {
    // Still resize if dimensions are too large
    return resizeImage(file);
  }

  return resizeImage(file);
}

function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Only resize if dimensions exceed max
      if (width <= MAX_WIDTH && height <= MAX_HEIGHT && file.size <= MAX_SIZE_MB * 1024 * 1024) {
        resolve(file);
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const ext = file.type === 'image/png' ? '.png' : '.jpg';
          const name = file.name.replace(/\.[^.]+$/, '') + `-compressed${ext}`;
          resolve(new File([blob], name, { type: blob.type }));
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo cargar la imagen'));
    };

    img.src = url;
  });
}
