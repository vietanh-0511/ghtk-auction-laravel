import Layout from "./Layout";

require('./bootstrap');
import {Routes, Route, HashRouter} from "react-router-dom";
import ReactDOM from "react-dom";
import React from "react";

export const App = () => {
  return (
    <>
      <Layout />
    </>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
    document.getElementById('root'));
}
