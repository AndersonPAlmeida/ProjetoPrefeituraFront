const path = require('path');
const webpackIsomorphicToolsConfig = require('../webpack/webpack-isomorphic-tools');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const rootDir = path.resolve(__dirname, '..');
/* .development is no longer used, instead it will check if the NODE_ENV variable has the value 'production' */
global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicToolsConfig)
  .server(rootDir, () => {
    require('./_server');
  });
