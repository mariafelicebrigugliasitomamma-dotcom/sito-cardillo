/**
 * Conversione lato browser: ridimensiona (lato lungo max 2000 px) e converte in WebP,
 * abbassando la qualità finché il file sta sotto `targetBytes`.
 * Usata dal pannello admin prima dell'upload, così si possono scegliere foto pesanti.
 */
export async function imageToWebp(
  file: File,
  { maxSide = 2000, targetBytes = 600 * 1024 } = {}
): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossibile elaborare l’immagine");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (quality: number) =>
    new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );

  let blob: Blob | null = null;
  for (const quality of [0.85, 0.78, 0.7, 0.6, 0.5]) {
    blob = await toBlob(quality);
    if (!blob || blob.type !== "image/webp") {
      throw new Error("Il browser non supporta la conversione in WebP");
    }
    if (blob.size <= targetBytes) break;
  }
  if (!blob) throw new Error("Conversione non riuscita");

  const name = file.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${name}.webp`, { type: "image/webp" });
}
