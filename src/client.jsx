import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';

const locale = Cookie.get('locale') || 'pt';

// ReactDOM.render(<App />, document.getElementById('react-view'));
ReactDOM.render(
    <IntlProvider locale={locale}>
      <App />
    </IntlProvider>,
    document.getElementById('react-view')
  );