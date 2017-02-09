import React from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
export default class Default extends React.Component {
  render() {
    const { assets, component, store, apiUrl } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    return (
      <html lang="en">
        <head>
          <title>Hello, world!</title>
          {/* production */}
          {Object.keys(assets.styles).map((style, key) =>
            <link
              href={assets.styles[style]}
              key={key} media="screen, projection"
              rel="stylesheet" type="text/css" charSet="UTF-8"
            />
          )}
          {/* development */}
          {
            Object.keys(assets.styles).length === 0 ?
              <style dangerouslySetInnerHTML={{ __html: require('../containers/App.css')._style }} /> : null
          }
          <script
            dangerouslySetInnerHTML={{ __html: `window.__API_URL__='${apiUrl}'` }}
            charSet="UTF-8"
          />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
            charSet="UTF-8"
          />
          <script
            src={
              assets.javascript.main
            }
            charSet="UTF-8"
          />
        </body>
      </html>
    );
  }
}
Default.propTypes = {
  assets: React.PropTypes.object,
  component: React.PropTypes.node,
  store: React.PropTypes.object,
  apiUrl: React.PropTypes.string
};
