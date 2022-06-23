import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

const Child = ({ returnComment }) => {
  useEffect(() => {
    console.log("Function was called");
  }, [returnComment]);

  return <div>{returnComment("Test Callback!")}</div>;
};

function UseCallbackTutorial() {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState("New Test Data!!!!!!!");

  // Prevents function re-render if state changes.. 
  // Similar to useMemo
  const returnComment = useCallback(
    (name) => {
      return data + name;
    },
    [data]
  );

  return (
    <div>
      <h1>UseCallback Tutorial</h1>
      <h4>Fucntion are always re-created at statechange.</h4>
      <h4>If passed to a child, the useEffect will fire is using this prop</h4>

      <Child returnComment={returnComment} />

      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Toggle
      </button>
      {toggle && <span>Toggled</span>}
    </div>
  );
}

export default UseCallbackTutorial;
