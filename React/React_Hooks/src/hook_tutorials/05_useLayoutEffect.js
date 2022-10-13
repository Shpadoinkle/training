import { useLayoutEffect, useEffect, useRef } from "react";

function LayoutEffectTutorial() {
  const inputRef = useRef(null);

  /**
   * Called earlier in render than useEffect
   */
  useLayoutEffect(() => {
    // This should log "Pedro" before useEffect changes value
    console.log(inputRef.current.value);
    console.log("useLayoutEffect");
  }, []);

  useEffect(() => {
    console.log("useEffect");
    inputRef.current.value = "VALUE CHANGED";
  }, []);

  return (
    <div>
      <h1>UseLayoutEffect Tutorial</h1>
      <input ref={inputRef} value="Pedro" />
    </div>
  );
}

export default LayoutEffectTutorial;
