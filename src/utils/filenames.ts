export const cleanName = (str: string) => {
  const name = str.slice(0, -4);
  return name;
};

export function zero_pad(num: number, size: number) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}
