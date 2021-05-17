import * as chokidar from 'chokidar';

export const getWatcher = (source: string): chokidar.FSWatcher => {
  return chokidar.watch(source, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 10000,
    },
  });
};
