import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
//import { TextEncoder, TextDecoder } from 'text-encoding';

import Composition from '../pages/Composition';
import Compose from '../pages/Compose';

// any css-in-js or other libraries you want to use server-side
//import { ServerStyleSheet } from 'styled-components';
//import { renderStylesToString } from 'emotion-server';
import Helmet from 'react-helmet';

global.React = React;
global.ReactDOM = ReactDOM;
global.ReactDOMServer = ReactDOMServer;

//global.Styled = { ServerStyleSheet };
global.Helmet = Helmet;

global.Components = { Composition, Compose };