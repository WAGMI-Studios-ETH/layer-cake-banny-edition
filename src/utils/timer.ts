import { zero_pad } from '.';

export const getTime = () => Date.now();
export const getElapsed = (now: number) => Date.now() - now;
export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function msToTime(ms: number) {
  let seconds: any = Math.floor((ms / 1000) % 60);
  let minutes: any = Math.floor((ms / (1000 * 60)) % 60);
  let hours: any = Math.floor(ms / (1000 * 60 * 60));
  hours = zero_pad(hours, 2);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return hours + ':' + minutes + ':' + seconds;
}
