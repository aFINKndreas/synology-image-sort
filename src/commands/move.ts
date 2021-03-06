import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import {getCheckDirectoryTasks} from '../helpers/getCheckDirectoryTasks';
import {getExifData} from '../helpers/getExifData';
import {getStatMDate} from '../helpers/getStatMDate';
import {isImageFile} from '../helpers/isImageFile';
import {isVideoFile} from '../helpers/isVideoFile';
import {moveMediaFile} from '../helpers/moveMediaFile';
import {moveUnkownFile} from '../helpers/moveUnkownFile';
import {getDirectoryFiles} from '../helpers/getDirectoryFiles';

export default class Move extends Command {
  static description = 'sort files from the source directory';
  static examples = [
    `$ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing`,
    `$ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing -t`,
    `$ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing -f YYYY/MM.YYYY/DD.MM.YYYY`,
    `$ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing -n DD.MM.YYYY-HH.mm.ss.SSS`,
  ];
  static flags = {
    help: flags.help({char: 'h'}),
    source: flags.string({char: 's', description: 'source directory', required: true}),
    destination: flags.string({char: 'd', description: 'destination directory', required: true}),
    unknown: flags.string({char: 'u', description: 'unknown directory', required: true}),
    existing: flags.string({char: 'e', description: 'existing directory', required: true}),
    format: flags.string({char: 'f', description: 'folder structure', default: 'YYYY/MM.YYYY/DD.MM.YYYY'}),
    name: flags.string({char: 'n', description: 'file name', default: 'DD.MM.YYYY-HH.mm.ss.SSS'}),
    tags: flags.boolean({
      char: 't',
      description: 'enable tagging for media files. adds parent folder names as exif-tags',
    }),
  };

  async run() {
    const {flags} = this.parse(Move);
    const source = flags.source;
    const destination = flags.destination;
    const unknown = flags.unknown;
    const existing = flags.existing;
    const format = flags.format;
    const name = flags.name;
    const tags = flags.tags;
    const checkDirectoryTasks = getCheckDirectoryTasks({source, destination, unknown, existing});
    await checkDirectoryTasks.run().catch(() => this.exit());
    cli.action.start('get files');
    const files = await getDirectoryFiles(source);
    cli.action.stop();
    for (let index = 0; index < files.length; index++) {
      const filepath = files[index];
      if (!(filepath.indexOf('SynoEAStream') >= 0 || filepath.indexOf('@eaDir') >= 0)) {
        this.log(`process file '${filepath}'`);
        const isImage = isImageFile(filepath);
        const isVideo = isVideoFile(filepath);
        if (isImage) {
          const exifData = await getExifData(filepath);
          const exifDate = exifData?.exif?.DateTimeOriginal ? new Date(exifData.exif.DateTimeOriginal) : undefined;
          if (!exifDate || exifDate.getFullYear() === 1970 || isNaN(exifDate.getFullYear())) {
            const statMDate = await getStatMDate(filepath);
            if (statMDate) {
              await moveMediaFile({filepath, date: statMDate, source, destination, existing, format, name, tags});
            }
          } else {
            await moveMediaFile({filepath, date: exifDate, source, destination, existing, format, name, tags});
          }
        } else if (isVideo) {
          const statMDate = await getStatMDate(filepath);
          if (statMDate) {
            await moveMediaFile({filepath, date: statMDate, source, destination, existing, format, name, tags});
          }
        } else {
          const statMDate = await getStatMDate(filepath);
          if (statMDate) {
            moveUnkownFile({filepath, date: statMDate, source, unknown, existing, format, name});
          }
        }
      }
    }
  }
}
