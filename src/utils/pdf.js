import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

// Re-encodes a scanned page to a compact JPEG (A4 @ ~150 dpi wide) and returns base64.
async function toBase64Jpeg(uri, width = 1240, compress = 0.8) {
  const ctx = ImageManipulator.manipulate(uri).resize({ width });
  const img = await ctx.renderAsync();
  const saved = await img.saveAsync({ format: SaveFormat.JPEG, compress, base64: true });
  return saved.base64;
}

export async function buildPdf(pageUris) {
  const parts = [];
  for (let i = 0; i < pageUris.length; i++) {
    const b64 = await toBase64Jpeg(pageUris[i]);
    const last = i === pageUris.length - 1;
    parts.push(
      `<div class="page"${last ? ' style="page-break-after:auto"' : ''}>` +
        `<img src="data:image/jpeg;base64,${b64}" /></div>`
    );
  }
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; }
  .page { width: 100%; height: 100vh; page-break-after: always; display: flex; align-items: center; justify-content: center; }
  img { max-width: 100%; max-height: 100%; object-fit: contain; }
</style></head><body>${parts.join('')}</body></html>`;

  const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
  return uri;
}

export function safeName(name) {
  const cleaned = (name || '').trim().replace(/[^\w\- ]+/g, '_').replace(/\s+/g, '_');
  return cleaned || 'SHAIS_Scan';
}

export async function sharePdf(pdfUri, name) {
  let shareUri = pdfUri;
  try {
    const dest = new File(Paths.cache, `${safeName(name)}.pdf`);
    if (dest.exists) dest.delete();
    new File(pdfUri).copy(dest);
    shareUri = dest.uri;
  } catch (e) {
    // If renaming fails, just share the generated file as is.
  }
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device');
  }
  await Sharing.shareAsync(shareUri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Save or share the scanned PDF',
  });
}

export async function rotatePage(uri, degrees = 90) {
  const ctx = ImageManipulator.manipulate(uri).rotate(degrees);
  const img = await ctx.renderAsync();
  const saved = await img.saveAsync({ format: SaveFormat.JPEG, compress: 0.92 });
  return saved.uri;
}
