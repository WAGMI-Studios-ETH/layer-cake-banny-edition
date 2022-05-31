import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdir, mkdirSync, rmSync } from 'fs';
import path from 'path';

export function exportProfileGif(images: string[], outputPath: string) {
  const temp = path.resolve(
    __dirname,
    `../../build/temp-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)}/`,
  );
  mkdirSync(temp);
  let i = 1;
  for (const image of images) {
    copyFileSync(image, path.resolve(temp, `${i.toString().padStart(3, '0')}.png`));
    i++;
  }
  const command = `ffmpeg -f image2 -framerate 2 -i ${temp}/%03d.png -loop 0 ${outputPath}`;
  execSync(command).toString('utf-8');
  console.log('Exec:', command);
  rmSync(temp, {
    recursive: true,
    force: true,
  });
  if (existsSync(outputPath)) {
    console.log(`Successfully created gif: ${outputPath}`);
    return true;
  }
  return false;
}
