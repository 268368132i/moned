
export type Action = {
  action: string,
  element?: string,
   [key: string]: any
}
export type ActionFunction =  (state: any, actionObj: Action)=> {[key: string]: any}
/**
 * Generate reducers with 'SET', 'START', 'FINISH', 'ERROR'
 * 'SETMANY', 'PENDING' actions. It is possible to supply an object 
 * with an array of custom functions, e.g. {MYACTION: (state, action)=>{}}.
 * All exceptions are caught inside the resulting reducer function and Error
 * from the 'catch' block are saved inside state.error.
 * @param customActions 
 * @returns {function}
 */
export function getReducer(
  customActions?: {[key: string]: ActionFunction},
  includeDefault: boolean = true
  ) {  
  const stdActions = {
    SET : (state: any, action: any) => {
      return { ...state, [action.element]: action.value }
    },
    START : (state: any, action: any) => {
      return { ...state, pending: true, error: false }
    },
    FINISH : (state: any, action: any) => {
      if (!action.element) {
        return { ...state, pending: false, error: false }
      }
      return { ...state, [action.element]: action.value, pending: false, error: false }
    },
    ERROR : (state: any, action: any) => {
      return { ...state, pending: false, error: action.value }
    },
    SETMANY : (state: any, action: any) => {
      return { ...state, ...action.value }
    },
    PENDING : (state: any, action: any) => {
      return { ...state, pending: action.value }
    },
  }
  let actions: {[key: string]: ActionFunction}
  console.log('include default actions: ', includeDefault)
  if (includeDefault){
    actions = { ...stdActions, ...customActions }
  } else if (customActions) {
    actions = customActions
  } else {
    actions = {}
  }
  console.log("StdActions: ", stdActions, " Actions: ", actions, "Custom actions: ", customActions)
  return function (state: {[key: string]: any}, actionObj: Action) {
    let newState: {[key: string]: any};
    try {
      console.log('Got actionObj: ', actionObj)
      if (typeof actions[actionObj.action] === "function") {
        return actions[actionObj.action](state, actionObj);
      } else {
        console.log(`Reducer error: invalid action ${actionObj.action}`);
        return state;
      }
    } catch (err: any) {
      const newState = { ...state, error: {} }
      let error: {[key: string]: any} = {}
      if (actionObj.element) {
        error[actionObj.element] = err
      } else {
        error = err
      }
      newState.error = error
      return newState
    }
  }
}