import axios from "axios";
import { useEffect, useMemo, useState } from "react";

function UseMemoTutorial() {
  const [data, setData] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/comments").then((res) => {
      console.log("RESPONSE");
      setData(res.data);
    });
  }, []);

  /**
   *
   * By default this would run with every function rerender if
   * accessed in the render.. ie <div>{findLongestName(name)}</div>
   */
  const findLongestName = (comments) => {
    if (!comments) return null;

    let longestName = "";

    comments.forEach((element) => {
      if (element.name.length > longestName.length) longestName = element.name;
    });

    console.log("This was computed");
    return longestName;
  };

  /**
   * First argument is the returned value,
   * in this case.. the result on findLongestName function
   */
  const getLongestName = useMemo(() => findLongestName(data), [data]);

  return (
    <div>
      <h1>UseMemo Tutorial</h1>
      <h4>
        Stops pointless re-computes on inner functions within the component
      </h4>

      <div>{getLongestName}</div>

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

export default UseMemoTutorial;
