/**
 * Image processing and compression utility for Conecta Itaú
 * Compresses smartphone photos in the browser before saving to Firestore.
 */

export async function compressImageFile(file: File, maxWidth = 1000, quality = 0.65): Promise<{ dataUrl: string; sizeFormatted: string }> {
  return new Promise((resolve, reject) => {
    // If it's a PDF, read as normal base64 without canvas resize
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          sizeFormatted: `${(file.size / 1024).toFixed(0)} KB`
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: e.target?.result as string,
            sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to efficient JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl: compressedDataUrl,
          sizeFormatted: `${approxSizeKb} KB`
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
