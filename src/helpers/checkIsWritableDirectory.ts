import * as fs from 'fs-extra';

export const checkIsWritableDirectory = async (folder: string, name: string): Promise<void> => {
  const sourceExists = await fs.pathExists(folder);
  if (!sourceExists) throw new Error(`${name} directory does not exist`);
  const lstat = await fs.lstat(folder);
  if (!lstat.isDirectory()) throw new Error(`${name} is not a directory`);
  try {
    await fs.access(folder, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`${name} is not readable`);
  }
  try {
    await fs.access(folder, fs.constants.W_OK);
  } catch (error) {
    throw new Error(`${name} is not writable`);
  }
};
