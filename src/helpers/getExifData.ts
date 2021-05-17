// @ts-ignore
import * as exif from 'fast-exif';

interface ExifData {
  image: {[key: string]: string | number};
  exif: {[key: string]: string | number};
}

export const getExifData = async (filepath: string): Promise<ExifData | undefined> => {
  try {
    const data = await exif.read(filepath);
    return data;
  } catch (error) {
    return undefined;
  }
};
