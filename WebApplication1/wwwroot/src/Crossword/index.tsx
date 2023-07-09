import * as _ from 'lodash';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CommentBox from './Tutorial';
const root = createRoot(document.getElementById("crossword-root") as HTMLElement);
root.render(
   <React.StrictMode>
       <CommentBox />
   </React.StrictMode>
);