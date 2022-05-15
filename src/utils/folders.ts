import { get_directories, logger } from '.';

export const scan_sort_folders = (dir: string) => {
  try {
    const files = get_directories(dir);
    const f = files
      .map(f => {
        const fObj = {} as any;
        fObj[Number(f.replace(/\D/g, ''))] = f;
        logger.debug(`${JSON.stringify(f)}`);
        return fObj;
      })
      .sort(function (a, b) {
        const keyA = Object.keys(a),
          keyB = Object.keys(b);
        return Number(keyA) - Number(keyB);
      });
    return f || undefined;
  } catch (e) {
    logger.error(`error:${e}`);
  }
};
