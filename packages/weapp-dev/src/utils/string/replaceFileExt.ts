export function replaceFileExt(file: string, ext: string) {
  return file.replace(/\.[^/.]+$/, `.${ext}`);
}
