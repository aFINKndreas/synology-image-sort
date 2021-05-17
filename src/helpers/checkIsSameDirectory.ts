interface CheckIsSameDirectoryProps {
  source: string;
  destination: string;
  unknown: string;
  existing: string;
}

export const checkIsSameDirectory = ({source, destination, unknown, existing}: CheckIsSameDirectoryProps): void => {
  const array = [source, destination, unknown, existing];
  const set = new Set(array);
  if (array.length !== set.size) {
    throw new Error('source, destination, unkown or existing directory are the same');
  }
};
