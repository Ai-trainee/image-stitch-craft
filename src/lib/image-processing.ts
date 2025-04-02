
export interface SplicedImageConfig {
  rows: number;
  columns: number;
  spacing: number;
  format: string;
  quality: number;
  autoSize: boolean;
}

export const createSplicedImage = async (
  images: File[],
  config: SplicedImageConfig
): Promise<Blob> => {
  const { rows, columns, spacing, format, quality, autoSize } = config;
  
  // Load all images
  const loadedImages = await Promise.all(
    images.map((file) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    })
  );

  // Calculate dimensions
  let maxWidth = 0;
  let maxHeight = 0;

  if (autoSize) {
    // Find the maximum dimensions
    for (const img of loadedImages) {
      maxWidth = Math.max(maxWidth, img.width);
      maxHeight = Math.max(maxHeight, img.height);
    }
  } else {
    // Use the first image as reference
    if (loadedImages.length > 0) {
      maxWidth = loadedImages[0].width;
      maxHeight = loadedImages[0].height;
    }
  }

  // Create canvas
  const canvas = document.createElement("canvas");
  const totalWidth = columns * maxWidth + (columns - 1) * spacing;
  const totalHeight = rows * maxHeight + (rows - 1) * spacing;
  
  canvas.width = totalWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set background as transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw images on canvas
  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (index >= loadedImages.length) break;

      const img = loadedImages[index];
      const x = c * (maxWidth + spacing);
      const y = r * (maxHeight + spacing);
      
      // Center the image in its cell
      const imgX = x + (maxWidth - img.width) / 2;
      const imgY = y + (maxHeight - img.height) / 2;
      
      ctx.drawImage(img, imgX, imgY);
      index++;
    }
  }

  // Convert to desired format
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create image blob"));
        }
      },
      `image/${format}`,
      quality / 100
    );
  });
};

export const downloadImage = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
