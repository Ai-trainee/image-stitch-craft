
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "image/x-icon",
  "image/bmp",
];

export const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/bmp": "bmp",
};

export const IMAGE_EXTENSIONS_DISPLAY = [
  { name: "jpg", checked: true },
  { name: "png", checked: true },
  { name: "webp", checked: true },
  { name: "gif", checked: true },
  { name: "avif", checked: true },
  { name: "svg", checked: true },
  { name: "ico", checked: true },
  { name: "bmp", checked: true },
];

export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_FORMATS.includes(file.type);
};
