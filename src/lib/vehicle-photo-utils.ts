const JPEG_QUALITY = 0.95;

const getExifOrientation = (buffer: ArrayBuffer): number => {
  const view = new DataView(buffer);
  if (view.getUint16(0, false) !== 0xffd8) return 1;

  let offset = 2;
  while (offset < view.byteLength - 2) {
    const marker = view.getUint16(offset, false);
    offset += 2;

    if (marker === 0xffe1) {
      const exifOffset = offset + 2;
      if (view.getUint32(exifOffset, false) !== 0x45786966) return 1;

      const tiffOffset = exifOffset + 6;
      const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;
      const ifdOffset = tiffOffset + view.getUint32(tiffOffset + 4, littleEndian);
      const entries = view.getUint16(ifdOffset, littleEndian);

      for (let i = 0; i < entries; i++) {
        const entryOffset = ifdOffset + 2 + i * 12;
        if (entryOffset + 12 > view.byteLength) break;
        if (view.getUint16(entryOffset, littleEndian) === 0x0112) {
          return view.getUint16(entryOffset + 8, littleEndian);
        }
      }

      return 1;
    }

    if ((marker & 0xff00) !== 0xff00) return 1;
    offset += view.getUint16(offset, false);
  }

  return 1;
};

const readAsArrayBuffer = (file: Blob) =>
  new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

const readAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const fileNameToJpeg = (fileName: string) => {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "photo";
  return `${baseName}.jpg`;
};

const canvasToFile = (canvas: HTMLCanvasElement, fileName: string) =>
  new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export image"));
          return;
        }

        resolve(new File([blob], fileNameToJpeg(fileName), { type: "image/jpeg" }));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

const createNormalizedCanvas = async (file: File) => {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const canvas = createCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d");

      if (!context) throw new Error("Canvas context not available");

      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      return canvas;
    } catch (error) {
      console.warn("createImageBitmap normalization failed, falling back to EXIF parsing", error);
    }
  }

  const [buffer, dataUrl] = await Promise.all([readAsArrayBuffer(file.slice(0, 65536)), readAsDataUrl(file)]);
  const orientation = getExifOrientation(buffer);
  const image = await loadImage(dataUrl);
  const needsSwap = orientation >= 5 && orientation <= 8;
  const canvasWidth = needsSwap ? image.height : image.width;
  const canvasHeight = needsSwap ? image.width : image.height;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Canvas context not available");

  switch (orientation) {
    case 2:
      context.transform(-1, 0, 0, 1, canvasWidth, 0);
      break;
    case 3:
      context.transform(-1, 0, 0, -1, canvasWidth, canvasHeight);
      break;
    case 4:
      context.transform(1, 0, 0, -1, 0, canvasHeight);
      break;
    case 5:
      context.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      context.transform(0, 1, -1, 0, canvasHeight, 0);
      break;
    case 7:
      context.transform(0, -1, -1, 0, canvasHeight, canvasWidth);
      break;
    case 8:
      context.transform(0, -1, 1, 0, 0, canvasWidth);
      break;
    default:
      break;
  }

  context.drawImage(image, 0, 0);
  context.setTransform(1, 0, 0, 1, 0, 0);

  return canvas;
};

export const normalizeImageFile = async (file: File) => {
  const canvas = await createNormalizedCanvas(file);
  return canvasToFile(canvas, file.name);
};

export const addTimestampToPhoto = async (file: File, rego?: string) => {
  const canvas = await createNormalizedCanvas(file);
  const context = canvas.getContext("2d");

  if (!context) return file;

  const now = new Date();
  const stamp = now.toLocaleString("en-NZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const label = rego ? `${stamp}  |  ${rego}` : stamp;
  const fontSize = Math.max(20, Math.floor(canvas.width / 30));
  const padding = 12;
  const baselineY = canvas.height - padding * 2;
  const textX = canvas.width - padding * 2;

  context.font = `bold ${fontSize}px Arial`;
  context.textAlign = "right";
  context.textBaseline = "alphabetic";

  const textWidth = context.measureText(label).width;
  const boxX = textX - textWidth - padding;
  const boxY = baselineY - fontSize - padding;

  context.fillStyle = "rgba(0, 0, 0, 0.6)";
  context.fillRect(boxX, boxY, textWidth + padding * 2, fontSize + padding * 2);
  context.fillStyle = "#ffffff";
  context.fillText(label, textX, baselineY);

  return canvasToFile(canvas, file.name);
};