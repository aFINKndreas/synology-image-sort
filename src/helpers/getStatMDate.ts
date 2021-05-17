import * as fs from 'fs-extra';

export const getStatMDate = (filepath: string): Date | undefined => {
  try {
    const stat = fs.statSync(filepath);
    return stat.mtime;
  } catch (error) {
    return undefined;
  }
};
