import * as recursive from 'recursive-readdir';

export const getDirectoryFiles = async (directory: string): Promise<string[]> => {
  const files = await recursive(directory, [
    (filepath) => filepath.indexOf('SynoEAStream') >= 0 || filepath.indexOf('@eaDir') >= 0,
  ]);
  return files;
};
