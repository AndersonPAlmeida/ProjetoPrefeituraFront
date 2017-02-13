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
          <title>Agendador</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
          <link rel="stylesheet" href="http://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css" />
          {/* production */}
          {
          Object.keys(assets.styles).map((style, key) =>
            <link
              href={assets.styles[style]}
              key={key} media="screen, projection"
              rel="stylesheet" type="text/css" charSet="UTF-8"
            />
          )
          }
          {/* development */}
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/styles/Home.css')._style }} /> : null }
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/styles/Login.css')._style }} /> : null }
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/styles/SignIn.css')._style }} /> : null }
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
