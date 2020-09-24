const app = require('./app');
const logger = require('../../src/libs/logger');
const { PORT } = require('../../src/config/envConfig');

app.listen(PORT, () => {
  logger.http(`Server listening at http://localhost:${PORT}`);
});
