import React from 'react';
import ReactDom from 'react-dom';
import HomeComponent from 'Component/home';

if (module.hot) {
  module.hot.accept();
}

ReactDom.render(<HomeComponent/>,document.getElementById('app-root'));
