import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NavLayer from './App';
import EPAPER from './Epaper';

ReactDOM.render(
    <div id="big-container">
      <NavLayer />
      <EPAPER src="/path_to_your_pdf.pdf" length="100" />
    </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
