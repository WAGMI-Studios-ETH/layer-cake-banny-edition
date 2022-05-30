import { logger, getTime } from '../utils';
import { Worker, WorkerOptions } from 'worker_threads';
import { Asset } from '../other/asset';

interface WorkerData {}

function generate_images(assets: Asset[], isLeader: boolean) {
  return new Promise((resolve, reject) => {
    const data = {
      workerData: {
        worker_typescript_path: './worker.ts',
        assets,
        isLeader,
      },
    };
    const worker = new Worker('./src/layering/worker.js', data);
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
    });
  });
}

const WORKERS = 5;
export async function generate_all_images(assets: Asset[]) {
  const timer = getTime();
  let done = 0;
  const len = assets.length;

  const chunk_size = Math.ceil(len / WORKERS);
  const promises = [];
  for (let i = 0; i < WORKERS; i++) {
    const from = i * chunk_size;
    const to = from + chunk_size - 1;
    const chunk = assets.slice(from, to + 1);

    if (chunk.length > 0) {
      promises.push(generate_images(chunk, i == 0));
    }
  }
  await Promise.all(promises).then(() => {
    logger.info(`images done.`);
  });
}
