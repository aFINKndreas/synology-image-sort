import * as formatDate from 'date-fns/format';
import * as deLocale from 'date-fns/locale/de';
import * as path from 'path';
import * as fs from 'fs-extra';
import {getFileChecksum} from './getFileChecksum';

interface MoveUnkownFileProps {
  filepath: string;
  date: Date;
  source: string;
  unknown: string;
  existing: string;
  format: string;
  name: string;
}

interface GetDateDirectoriesProps {
  unknown: string;
  formattedFolderDate: string;
}

interface GetSourceFileDirectoryProps {
  filepath: string;
  source: string;
}

const getDateDirectories = ({unknown, formattedFolderDate}: GetDateDirectoriesProps) => {
  const tmpArray = formattedFolderDate.split('/');
  return tmpArray.map((_, index) => {
    const prev = tmpArray.slice(0, index + 1);
    return `${unknown}/${prev.join('/')}`;
  });
};

const createDirectoriesIfNotExist = (directories: string[]) => {
  directories.forEach((directory) => {
    const exists = fs.existsSync(directory);
    if (!exists) {
      fs.mkdirSync(directory);
    }
  });
};

const getSourceFileDirectories = ({filepath, source}: GetSourceFileDirectoryProps): string[] => {
  const directory = filepath
    .replace(source.replace('./', '') + '/', '')
    .replace('/' + path.basename(filepath), '')
    .trim();
  if (!directory) return [];
  const tmpArray = directory.split('/');
  return tmpArray
    .map((_, index) => {
      const prev = tmpArray.slice(0, index + 1);
      return `${source}/${prev.join('/')}`;
    })
    .reverse();
};

export const moveUnkownFile = ({
  filepath,
  date,
  source,
  unknown,
  existing,
  format,
  name,
}: MoveUnkownFileProps): boolean => {
  try {
    const formattedFolderDate = formatDate(date, format, {locale: deLocale});
    const formattedFileDate = formatDate(date, name, {locale: deLocale});
    const dateDirectories = getDateDirectories({unknown, formattedFolderDate});
    const directory = `${unknown}/${formattedFolderDate}`;
    const fileExtension = path.extname(filepath).replace('.jpeg', '.jpg').toLocaleLowerCase();
    const currentChecksum = getFileChecksum(filepath);
    const fileName = `${formattedFileDate}-${currentChecksum}${fileExtension}`;
    const sourceFileDirectories = getSourceFileDirectories({filepath, source});
    createDirectoriesIfNotExist(dateDirectories);
    const exists = fs.existsSync(`${directory}/${fileName}`);
    if (!exists) {
      fs.renameSync(filepath, `${directory}/${fileName}`);
      sourceFileDirectories.forEach((sourceFileDirectory) => {
        const files = fs.readdirSync(sourceFileDirectory);
        if (files.length === 0) {
          fs.rmdirSync(sourceFileDirectory);
        }
      });
    } else {
      const files = fs.readdirSync(existing);
      const index = files.length + 1;
      fs.renameSync(filepath, `${existing}/#${index}-${fileName}`);
      sourceFileDirectories.forEach((sourceFileDirectory) => {
        const files = fs.readdirSync(sourceFileDirectory);
        if (files.length === 0) {
          fs.rmdirSync(sourceFileDirectory);
        }
      });
    }
    return true;
  } catch (error) {
    console.log('moveUnkownFile', error);
    return false;
  }
};
