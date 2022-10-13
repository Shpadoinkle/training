import { useRef } from "react";

function UseRefTutorial() {
  const inputRef = useRef(null);

  const onClick = () => {
    // Accessing input value using ref
    console.log(inputRef.current.value);

    // Focusing on inputs using refs
    inputRef.current.focus();

    // Clear input using ref
    inputRef.current.value = "";
  };

  return (
    <div>
      <h1>useRef Tutorial</h1>
      <h2>Pedro</h2>
      <input type="text" placeholder="Ex..." ref={inputRef} />
      <button onClick={onClick}>Change Name</button>
    </div>
  );
}

export default UseRefTutorial;
