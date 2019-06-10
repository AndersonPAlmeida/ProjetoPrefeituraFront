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

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
/* settle the extensions and use url-loader to parse */
module.exports = {
  assets: {
    images: {
      extensions: [
        'jpeg',
        'jpg',
        'png',
        'gif',
      ],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    fonts: {
      extensions: [
        'woff',
        'woff2',
        'ttf',
        'eot',
      ],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    svg: {
      extension: 'svg',
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    style_modules: {
      extension: 'css',
      filter(module, regex, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
        }
        return regex.test(module.name);
      },
      path(module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
        }
        return module.name;
      },
      parser(module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
        }
        return module.source;
      },
    },
  },
};
