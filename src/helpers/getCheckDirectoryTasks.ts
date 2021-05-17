import * as Listr from 'listr';
import {checkIsWritableDirectory} from '../helpers/checkIsWritableDirectory';
import {checkIsSameDirectory} from '../helpers/checkIsSameDirectory';

interface GetCheckDirectoryTasksProps {
  source: string;
  destination: string;
  unknown: string;
  existing: string;
}

export const getCheckDirectoryTasks = ({
  source,
  destination,
  unknown,
  existing,
}: GetCheckDirectoryTasksProps): Listr => {
  return new Listr([
    {
      title: 'check directories',
      task: () => {
        return new Listr(
          [
            {
              title: 'checking source directory',
              task: async () => {
                await checkIsWritableDirectory(source, 'source');
              },
            },
            {
              title: 'checking destination directory',
              task: async () => {
                await checkIsWritableDirectory(destination, 'destination');
              },
            },
            {
              title: 'checking unknown directory',
              task: async () => {
                await checkIsWritableDirectory(unknown, 'unknown');
              },
            },
            {
              title: 'checking existing directory',
              task: async () => {
                await checkIsWritableDirectory(existing, 'existing');
              },
            },
            {
              title: 'checking destination, source, unknown and existing directory',
              task: async () => {
                checkIsSameDirectory({source, destination, unknown, existing});
              },
            },
          ],
          {exitOnError: false, concurrent: false}
        );
      },
    },
  ]);
};
