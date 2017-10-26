import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import App from './components/App';

//Importing the accept-language package 
import cookieParser from 'cookie-parser';
import acceptLanguage from 'accept-language';
import { IntlProvider } from 'react-intl';

//Setting up Portuguese and English locales as supported
acceptLanguage.languages = (['pt', 'en']);
const app = express();
app.use(cookieParser);

//Fetches a locale value from a cookie; 
//if none is found, then the HTTP Accept-Language header is processed,
//or falls back to the default locale 
function detectLocale(req) {
  const cookieLocale = req.cookies.locale;

  return acceptLanguage.get(cookieLocale || req.header['accept-language']) || 'pt';
}

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
      </body>
    </html>
  `;
}

app.use((req, res) => {
  // const componentHTML = ReactDom.renderToString(<App />);
  const componentHTML = ReactDom.renderToString(
    <IntlProvider locale={locale}>
      <App />
    </IntlProvider>
  )

  //After the request is processed, we add the HTTP header Set-Cookie for the
  //locale detected in the response. This value will be used for all subsequent requests.
  res.cookie('locale', locale, { maxAge: (new Date() * 0.001) + (365 * 24 * 3600) });
  return res.end(renderHTML(componentHTML));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`); // eslint-disable-line no-console
});
