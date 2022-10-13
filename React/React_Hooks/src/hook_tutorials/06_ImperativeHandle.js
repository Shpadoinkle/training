import { forwardRef, useImperativeHandle, useRef, useState } from "react";

/**
 *
 * Forward ref allows parent to access child props/functions
 */
const Button = forwardRef((props, ref) => {
  const [toggle, setToggle] = useState(false);

  /**
   *
   * Accept ref from parent,
   * return an object.
   *
   * Can give access to functions within this
   * component for parent to use.
   */
  useImperativeHandle(ref, () => ({
    alterToggle() {
      setToggle(!toggle);
    },
  }));

  return (
    <>
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Button from Child
      </button>
      {toggle && <span>Toggle</span>}
    </>
  );
});

function ImperativeHandle() {
  const buttonRef = useRef(null);

  return (
    <div>
      <h1>ImperativeHandle Tutorial</h1>
      <h4>Passing Refs between parent and child</h4>
      <h4>Access child functions from Parent -- Cool!</h4>
      <button
        onClick={() => {
          buttonRef.current.alterToggle();
        }}
      >
        Button From Parent
      </button>
      <Button ref={buttonRef} />
    </div>
  );
}

export default ImperativeHandle;
