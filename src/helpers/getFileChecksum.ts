import * as fs from 'fs-extra';
import * as crypto from 'crypto';

export const getFileChecksum = (filepath: string): string => {
  const data = fs.readFileSync(filepath);
  const hash = crypto
    .createHash('md5')
    .update(data as any, 'utf8')
    .digest('hex');
  return hash;
};
