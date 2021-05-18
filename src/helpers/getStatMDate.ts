import * as fs from 'fs-extra';

export const getStatMDate = async (filepath: string): Promise<Date | undefined> => {
  try {
    const stat = await fs.stat(filepath);
    return stat.mtime;
  } catch (error) {
    return undefined;
  }
};
