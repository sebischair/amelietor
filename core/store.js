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
import { showRec } from './actions'
import amelietor from './reducers'
import createLogger from 'redux-logger';
// Centralized application state
// For more information visit http://redux.js.org/
export default function configureStore(preloadedState) {
  const store = createStore(
    amelietor,
    preloadedState,
    applyMiddleware(thunk, createLogger())
  );
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer)
     });
// =======
// const store = createStore((state, action) => {
//   // TODO: Add action handlers (aka "reducers")
//   switch (action) {
//     case 'COUNT':
//       return { ...state, count: (state.count || 0) + 1 };
//     default:
//       return state;
// >>>>>>> react-static-boilerplate/master
  }


return store;
}
