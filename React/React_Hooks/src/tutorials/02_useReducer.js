import { useReducer } from "react";

/**
 * Use state and use reducer tutorial
 */
const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
      };
    case "toggleShowText":
      return { ...state, showText: !state.showText };
    default:
      return state;
  }
};

function UseReducerTutorial() {
  //#region
  /**
   * Use reducer tutorial
   */ const [state, dispatch] = useReducer(reducer, {
    count: 0,
    showText: false,
  });

  return (
    <div>
    <h1>useReducer Tutorial</h1>
      <h2>Count {state.count}</h2>
      <button
        onClick={() => {
          dispatch({ type: "INCREMENT" });
          dispatch({ type: "toggleShowText" });
        }}
      >
        Click here
      </button>
      {state.showText && <div>Showing text</div>}
    </div>
  );
  //#endregion
}

export default UseReducerTutorial;
