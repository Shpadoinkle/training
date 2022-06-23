import { createContext, useState, useContext } from "react";

/**
 *
 * Check parent component at bottom of file
 * for context creation
 */

const Login = () => {
  const { setUsername } = useContext(AppContext);
  return (
    <input
      onChange={(event) => {
        setUsername(event.target.value);
      }}
    />
  );
};

const User = () => {
  const { username } = useContext(AppContext);
  return (
    <div>
      <h2>User: {username}</h2>
    </div>
  );
};

/**
 *
 * Context is a collection of states
 * can access from other components
 */
const AppContext = createContext(null);

function UseContextTutorial() {
  const [username, setUsername] = useState("");

  /**
   * Pass these into the context provider. 
   * This can then be read by any child within the tags
   */
  return (
    <AppContext.Provider value={{ username, setUsername }}>
      <h1>UseContext Tutorial</h1>
      <h4>Access context values and functions without passing props</h4>
      <Login />
      <User />
    </AppContext.Provider>
  );
}

export default UseContextTutorial;
