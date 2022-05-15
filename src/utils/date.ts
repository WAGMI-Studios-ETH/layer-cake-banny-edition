import moment from 'moment';

export const now = new Date();
export const eight_char_date = moment(now).format('YYYYMMDD').toString();
export const number_with_commas = (x: number | string) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const twelve_char_date = () => {
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);
  const seconds = ('0' + now.getSeconds()).slice(-2);
  const ms = '0' + now.getMilliseconds();
  return `${eight_char_date}${hours}`;
};

export const datetime = twelve_char_date();

export const compactLoggingTime = () => {
  try {
    const hours = ('0' + now.getHours()).slice(-2); // 0-23
    const minutes = ('0' + now.getMinutes()).slice(-2); // 0-59
    const seconds = ('0' + now.getSeconds()).slice(-2);
    const ms = '0' + now.getMilliseconds(); //.slice(-2);
    return `[${hours}h:${minutes}m:${seconds}s:${ms}ms]`;
  } catch (e) {
    console.error(e);
    return e;
  }
};
