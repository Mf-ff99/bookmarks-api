const path = require('path');
const { format, transports, createLogger } = require('winston');
require('winston-daily-rotate-file');

const { NODE_ENV } = require('../../src/config/envConfig');

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize({ colors: { info: 'blue' } }),
  format.timestamp({ format: 'HH:mm:ss' }),
  format.align(),
  format.printf((info) => `[${info.timestamp}] ❗${info.level}: ${info.message}`)
);

const logger = createLogger();

// create levels to generate unique transports
const levels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

levels.forEach((level) => {
  const filter = format((log) => (log.level === level ? log : false));

  const transport = new transports.DailyRotateFile({
    dirname: path.join(__dirname, 'logs/'),
    filename: `${level}.%DATE%.log`,
    auditFile: path.join(__dirname, `logs/audits/audit-${level}.json`),
    level,
    maxSize: '20m',
    maxFiles: '1',
    zippedArchive: true,
    format: format.combine(filter(), fileFormat)
  });

  logger.add(transport);
});

if (NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: consoleFormat
    })
  );
}

module.exports = logger;
