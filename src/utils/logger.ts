import moment from 'moment';
import winston, { format } from 'winston';

process.on('SIGTERM', () => {
  process.stdout.write(`\n`);
  logger.info('received SIGTERM, exiting gracefully');
  process.exit(0);
});

const datetime = `${moment(new Date()).format('YYYYMMDD-HHmmssSS').toString()}`;

export const logger = winston.createLogger({
  level: 'debug',
  transports: [    
    new winston.transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.prettyPrint(),
        format.colorize({ all: true }),
        format.printf(info => {
          const { level, message, ...rest } = info;
          return JSON.stringify({}) === '{}'
            ? `[${level}][${moment(new Date()).format('YYYYMMDD-HHmmssSS').toString()}] ${message} `
            : `[${level}][${moment(new Date()).format('YYYYMMDD-HHmmssSS').toString()}] ${message} ${JSON.stringify(
                rest,
              )}`;
        }),
      ),
    }),
  ],
});

export function log_traits_arrays(priorities: any[], arrays: any[][]) {
  arrays.map((traits, index) => {
    logger.info(`${priorities[index]}`);
    traits.map(trait => {
      logger.info(` ${trait.value}`);
    });
  });
};

export function log_backgrounds(backgrounds: any[]) {
  logger.info(`Backgrounds`);
  backgrounds.map(b => {
    logger.info(`  ${b}`);
  });
  logger.info(`\n`);
};
