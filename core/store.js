/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore } from 'redux';
import { showRec } from './actions';
// Centralized application state
// For more information visit http://redux.js.org/

const initialState = {
  href: ""
};

const store = createStore((state = initialState, action) => {
  // TODO: Add action handlers (aka "reduces")
  switch (action.type) {
    case 'COUNT':
      return { ...state, count: (state.count || 0) + 1 };
    case 'SHOW_REC':
      console.log("Show recommendation:")
      console.log(action);
      return Object.assign({}, state, {
        href: action.href
      });
    default:
      console.log("default type:")
      console.log(action);
      return state;
  }
});


export default store;
