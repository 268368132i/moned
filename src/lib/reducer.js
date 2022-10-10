export function getReducer(customActions = []) {
  
  const stdActions = {
    SET : (state, action) => {
      return { ...state, [action.element]: action.value }
    },
    START : (state, action) => {
      return { ...state, pending: true, error: false }
    },
    FINISH : (state, action) => {
      if (!action.element) {
        return { ...state, pending: false, error: false }
      }
      return { ...state, [action.element]: action.value, pending: false, error: false }
    },
    ERROR : (state, action) => {
      return { ...state, pending: false, error: action.value }
    },
    SETMANY : (state, action) => {
      return { ...state, ...action.value }
    },
    PENDING : (state, action) => {
      return { ...state, pending: action.value }
    },
  }
  const actions = { ...stdActions, ...customActions };
  console.log("StdActions: ", stdActions, " Actions: ", actions, "Custom actions: ", customActions)
  return function (state, action) {
    let newState;
    try {
      if (typeof actions[action.action] === "function") {
        return actions[action.action](state, action);
      } else {
        console.log(`Reducer error: invalid action ${action.action}`);
        return state;
      }
    } catch (err) {
      const newState = { ...state, error: {} }
      newState.error[action.element] = err
      return newState
    }
  }
}