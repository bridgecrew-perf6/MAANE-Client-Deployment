import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import CssBaseline from "@mui/material/CssBaseline";

import {BrowserRouter} from "react-router-dom";
import {ThemeProvider, createTheme, } from "@mui/material/styles";
import {} from "@mui/material/colors"

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from 'stylis-plugin-rtl';

// for theming the website
const theme = createTheme({
    palette: {
        background: {
            default: '#ffffff'
        },
        primary: {
            main: '#0336FF'
        },
        secondary: {
            main: '#0336FF'
        },
    },
    direction: 'rtl',
})

// for rtl
const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin]
});

ReactDOM.render(
  <React.StrictMode>
      {/*wrapper for ltr*/}
      <CacheProvider value={cacheRtl}>
          {/*wrapper for theme*/}
          <ThemeProvider theme={theme}>
              <CssBaseline/>
              <BrowserRouter>
                <App/>
              </BrowserRouter>
          </ThemeProvider>
      </CacheProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
