require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV, CORS_ORIGIN } = require('../../src/config/envConfig');

const errors = require('../../src/middlewares/errors');

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev';

const app = express();
app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express boilerplate initialized!');
});

/*
| ROUTES HERE -------------------------
*/

/*
|--------------------------------------
*/

app.use(errors.notFound);
app.use(errors.errorHandler);

module.exports = app;
