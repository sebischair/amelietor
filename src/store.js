/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { showRec } from './../core/actions'
import amelietor from './../core/reducers'
import {createLogger} from 'redux-logger';
import { sessionService } from 'redux-react-session';
// Centralized application state
// For more information visit http://redux.js.org/
export default function configureStore(preloadedState) {
  const store = createStore(
    amelietor,
    preloadedState,
    applyMiddleware(thunk, createLogger())
  );

  sessionService.initSessionService(store);
  return store;
}
