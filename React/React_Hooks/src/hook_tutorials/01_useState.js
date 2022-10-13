import { useState } from "react";

function UseStateTutorial() {
  //#region
  /**
   * Use state tutorial
   */
  const [count, setCount] = useState(0);
  const [showText, setShowText] = useState(true);

  return (
    <div>
      <h1>useState Tutorial</h1>
      <h2>Count {count}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click here
      </button>
      {showText && <div>Showing text</div>}
    </div>
  );
  //#endregion
}

export default UseStateTutorial;

