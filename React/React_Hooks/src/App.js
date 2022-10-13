import React, { useState } from "react";
import "./App.css";
import Pages from "./hook_tutorials/index";

function App() {
  const [pageNumber, setPage] = useState(0);

  return (
    <div>
      <h1>React Tutorials</h1>
      <div>
        {Pages.map((e, i) => <button key={i}
          onClick={() => {
            setPage(i);
          }}
        >
          {e.name}
        </button>)}
      </div>
      {React.createElement(Pages[pageNumber].page)}
    </div>
  );
}

export default App;
