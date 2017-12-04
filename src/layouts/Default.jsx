import React from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import PropTypes from 'prop-types';

export default class Default extends React.Component {
  render() {
    const { assets, component, store, apiUrl } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    return (
      <html lang="en">
        <head>
          <title>Agendador</title>
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
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/application/styles/Home.css')._style }} /> : null }
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/account/styles/Login.css')._style }} /> : null }
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/account/styles/SignIn.css')._style }} /> : null }
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/account/styles/SignUp.css')._style }} /> : null }
          { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/account/styles/SignUpForm.css')._style }} /> : null }
          <script
            dangerouslySetInnerHTML={{ __html: `window.__API_URL__='${apiUrl}'` }}
            charSet="UTF-8"
          />

        </head>
        <body>
          <script src="https://code.jquery.com/jquery-2.1.1.min.js" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js" />
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} charSet="UTF-8" />
          <script src={ assets.javascript.main } charSet="UTF-8" />
          <script defer="defer" src="//barra.brasil.gov.br/barra.js" type="text/javascript"></script>
        </body>
      </html>
    );
  }
}
Default.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
  apiUrl: PropTypes.string
};
