import * as path from 'path';

export const isImageFile = (filepath: string): boolean => {
  const extension = path.extname(filepath).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.raw', '.heic'];
  return imageExtensions.findIndex((item) => item === extension) != -1;
};
