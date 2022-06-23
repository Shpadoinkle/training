import axios from "axios";
import { useEffect, useState } from "react";

function UseEffectTutorial() {
  //#region
  /**
   * UseEffect hook tutorial
   */
  const [data, setData] = useState("");
  const [count, setCount] = useState(1);

  // Initial function without second [] value would re-render after data is updated.. therefore
  // fetch api twice.

  // Adding count to second value, function will run only if the count state is updated
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/comments").then((res) => {
      console.log("RESPONSE");
      setData(res.data[0].email);
    });
  }, [count]);

  return (
    <div>
      <h1>useEffect Tutorial</h1>
      <h2>Api Calls {count}</h2>
      <div>{data}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click here
      </button>
    </div>
  );
  //#endregion
}

export default UseEffectTutorial;
