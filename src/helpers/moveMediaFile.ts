import * as formatDate from 'date-fns/format';
import * as deLocale from 'date-fns/locale/de';
import * as path from 'path';
import * as fs from 'fs-extra';
import {exec} from 'child_process';
// @ts-ignore
import * as ExifTool from 'exiftool-kit';
import {getFileChecksum} from './getFileChecksum';
import {isImageFile} from './isImageFile';

const exiftool = new ExifTool();

interface MoveImageFileProps {
  filepath: string;
  date: Date;
  source: string;
  destination: string;
  existing: string;
  format: string;
  name: string;
  tags: boolean;
}

interface GetDateDirectoriesProps {
  destination: string;
  formattedFolderDate: string;
}

interface GetFolderTagsProps {
  filepath: string;
  source: string;
}

interface SetExifFolderTagsProps {
  filepath: string;
  folderTags: string[];
}

interface GetSourceFileDirectoryProps {
  filepath: string;
  source: string;
}

const getDateDirectories = ({destination, formattedFolderDate}: GetDateDirectoriesProps) => {
  const tmpArray = formattedFolderDate.split('/');
  return tmpArray.map((_, index) => {
    const prev = tmpArray.slice(0, index + 1);
    return `${destination}/${prev.join('/')}`;
  });
};

const createDirectoriesIfNotExist = (directories: string[]) => {
  directories.forEach((directory) => {
    const exists = fs.existsSync(directory);
    if (!exists) {
      fs.mkdirSync(directory);
      exec(`synoindex -A ${directory}`);
    }
  });
};

const getFolderTags = ({filepath, source}: GetFolderTagsProps): string[] => {
  return filepath
    .replace(source.replace('./', '') + '/', '')
    .replace('/' + path.basename(filepath), '')
    .trim()
    .split('/');
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

const setExifFolderTags = ({filepath, folderTags}: SetExifFolderTagsProps) => {
  try {
    exiftool.setTags({
      source: filepath,
      tags: folderTags.map((value) => ({tag: 'iptc:keywords', value})),
    });
  } catch (error) {}
};

export const moveMediaFile = ({
  filepath,
  date,
  source,
  destination,
  existing,
  format,
  name,
  tags,
}: MoveImageFileProps): boolean => {
  try {
    const isImage = isImageFile(filepath);
    const formattedFolderDate = formatDate(date, format, {locale: deLocale});
    const formattedFileDate = formatDate(date, name, {locale: deLocale});
    const dateDirectories = getDateDirectories({destination, formattedFolderDate});
    const directory = `${destination}/${formattedFolderDate}`;
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
      if (tags && isImage) {
        const folderTags = getFolderTags({filepath, source});
        if (!!folderTags.length) {
          setExifFolderTags({filepath: `${directory}/${fileName}`, folderTags});
        }
      }
      exec(`synoindex -a ${directory}/${fileName}`);
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
      if (tags && isImage) {
        const folderTags = getFolderTags({filepath, source});
        if (!!folderTags.length) {
          setExifFolderTags({filepath: `${existing}/#${index}-${fileName}`, folderTags});
        }
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};
