import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import {getCheckDirectoryTasks} from '../helpers/getCheckDirectoryTasks';
import {getExifData} from '../helpers/getExifData';
import {getStatMDate} from '../helpers/getStatMDate';
import {getWatcher} from '../helpers/getWatcher';
import {isImageFile} from '../helpers/isImageFile';
import {isVideoFile} from '../helpers/isVideoFile';
import {moveMediaFile} from '../helpers/moveMediaFile';
import {moveUnkownFile} from '../helpers/moveUnkownFile';

export default class Watch extends Command {
  static description = 'sort files (images, videos) on synology nas';
  static examples = [
    `$ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing`,
    `$ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing -t`,
    `$ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing -f YYYY/MM.YYYY/DD.MM.YYYY`,
    `$ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing -n DD.MM.YYYY-HH.mm.ss.SSS`,
  ];
  static flags = {
    help: flags.help({char: 'h'}),
    source: flags.string({char: 's', description: 'source directory', required: true}),
    destination: flags.string({char: 'd', description: 'destination directory', required: true}),
    unknown: flags.string({char: 'u', description: 'unknown directory', required: true}),
    existing: flags.string({char: 'e', description: 'existing directory', required: true}),
    format: flags.string({char: 'f', description: 'date format', default: 'YYYY/MM.YYYY/DD.MM.YYYY'}),
    name: flags.string({char: 'n', description: 'file name', default: 'DD.MM.YYYY-HH.mm.ss.SSS'}),
    tags: flags.boolean({char: 't', description: 'set folder tags'}),
  };

  async run() {
    const {flags} = this.parse(Watch);
    const source = flags.source;
    const destination = flags.destination;
    const unknown = flags.unknown;
    const existing = flags.existing;
    const format = flags.format;
    const name = flags.name;
    const tags = flags.tags;
    const checkDirectoryTasks = getCheckDirectoryTasks({source, destination, unknown, existing});
    await checkDirectoryTasks.run().catch(() => this.exit());
    const watcher = getWatcher(source);
    cli.action.start('watch for files');
    watcher.on('add', async (filepath) => {
      if (filepath.indexOf('SynoEAStream') >= 0 || filepath.indexOf('@eaDir') >= 0) return;
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
          await moveUnkownFile({filepath, date: statMDate, source, unknown, existing, format, name});
        }
      }
    });
  }
}
