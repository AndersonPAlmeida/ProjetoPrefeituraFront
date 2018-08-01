/*
 * This file is part of Agendador.
 *
 * Agendador is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Agendador is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
 */

import express from 'express';
import webpack from 'webpack';
const { host, port, webpackPort } = require('../config/env');
const webpackConfig = require('../webpack/dev.config');
const compiler = webpack(webpackConfig);
const serverOptions = {
  contentBase: '//${host}:${port}',
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
};
const app = express();
app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));
app.listen(webpackPort, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Webpack development server listening on port ${webpackPort}`);
  }
});
