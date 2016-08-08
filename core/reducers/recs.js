const recs = (state = {href: ""}, action) => {
  switch (action.type) {
    case 'SHOW_REC':
      console.log("Show recommendation:");
      console.log(action);
      return Object.assign({}, state, {
        href: action.href
      });
    default:
      return state
  }
};

export default recs
