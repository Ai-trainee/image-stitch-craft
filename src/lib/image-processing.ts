
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
): Promise<{ blob: Blob, canvas: HTMLCanvasElement }> => {
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

  // Handle empty images array
  if (loadedImages.length === 0) {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({ blob, canvas });
        } else {
          // Fallback if toBlob fails
          const defaultBlob = new Blob([], { type: `image/${format}` });
          resolve({ blob: defaultBlob, canvas });
        }
      }, `image/${format}`, quality / 100);
    });
  }

  // Calculate dimensions based on the layout mode
  let maxWidth = 0;
  let maxHeight = 0;
  let actualRows = rows;
  let actualColumns = columns;
  
  // For single mode - always display images in a single row
  if (rows === 1 && columns === 1 && loadedImages.length > 1) {
    actualRows = 1;
    actualColumns = loadedImages.length;
  }

  if (autoSize) {
    // Find the maximum dimensions from all images
    for (const img of loadedImages) {
      maxWidth = Math.max(maxWidth, img.width);
      maxHeight = Math.max(maxHeight, img.height);
    }
  } else {
    // For uniform size, use the dimensions of the first image for all
    if (loadedImages.length > 0) {
      maxWidth = loadedImages[0].width;
      maxHeight = loadedImages[0].height;
    }
  }

  // Create canvas with appropriate dimensions
  const canvas = document.createElement("canvas");
  const totalWidth = actualColumns * maxWidth + Math.max(0, (actualColumns - 1) * spacing);
  const totalHeight = actualRows * maxHeight + Math.max(0, (actualRows - 1) * spacing);
  
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
  for (let r = 0; r < actualRows; r++) {
    for (let c = 0; c < actualColumns; c++) {
      if (index >= loadedImages.length) break;

      const img = loadedImages[index];
      const x = c * (maxWidth + spacing);
      const y = r * (maxHeight + spacing);
      
      if (autoSize) {
        // Center the image in its cell
        const imgX = x + (maxWidth - img.width) / 2;
        const imgY = y + (maxHeight - img.height) / 2;
        ctx.drawImage(img, imgX, imgY);
      } else {
        // For uniform size, resize all images to the first image's dimensions
        ctx.drawImage(img, x, y, maxWidth, maxHeight);
      }
      
      index++;
    }
  }

  // Convert to desired format
  return new Promise<{ blob: Blob, canvas: HTMLCanvasElement }>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, canvas });
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

export const copyImageToClipboard = async (canvas: HTMLCanvasElement): Promise<boolean> => {
  try {
    // Try the Clipboard API first (most modern browsers)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to create blob from canvas"));
      });
    });

    // Use the clipboard API to copy
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    
    return true;
  } catch (error) {
    console.error("Error copying image to clipboard:", error);
    
    try {
      // Fallback for browsers that don't support ClipboardItem
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // Create a temporary image element
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            
            // Create a temporary div for the image
            const div = document.createElement('div');
            div.contentEditable = 'true';
            div.style.position = 'fixed';
            div.style.opacity = '0';
            div.appendChild(img);
            
            // Add to DOM, select, and try to copy
            document.body.appendChild(div);
            
            // Select the image
            const range = document.createRange();
            range.selectNode(div);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            
            // Execute copy command
            const success = document.execCommand('copy');
            
            // Clean up
            selection?.removeAllRanges();
            document.body.removeChild(div);
            URL.revokeObjectURL(img.src);
            
            return success;
          } catch (fallbackError) {
            console.error("Fallback copy method failed:", fallbackError);
            return false;
          }
        }
        return false;
      });
    } catch (fallbackError) {
      console.error("All copy methods failed:", fallbackError);
      return false;
    }
    
    return false;
  }
};

export const createPreviewLayout = async (
  images: File[],
  config: SplicedImageConfig
): Promise<string> => {
  try {
    const { blob, canvas } = await createSplicedImage(images, config);
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error creating preview:", error);
    return "";
  }
};
