import * as path from 'path';

export const isVideoFile = (filepath: string): boolean => {
  const extension = path.extname(filepath).toLowerCase();
  const imageExtensions = ['.mov', '.mp4', '.mpg', '.mpeg', '.wmv', '.avi', '.avchd', '.ogg'];
  return imageExtensions.findIndex((item) => item === extension) != -1;
};
