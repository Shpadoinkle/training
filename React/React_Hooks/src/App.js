import { useState } from "react";
import "./App.css";
import * as Pages from "./tutorials/index";

const renderPage = (page) => {
  switch (page) {
    case 1:
      return <Pages.UseState />;
    case 2:
      return <Pages.UseReducer />;
    case 3:
      return <Pages.UseEffect />;
    case 4:
      return <Pages.UseRef />;
    case 5:
      return <Pages.UseLayoutEffect />;
    case 6:
      return <Pages.ImperativeHandle />;
    case 7:
      return <Pages.UseContext />;
    case 8:
      return <Pages.UseMemo />;
    case 9:
      return <Pages.UseCallback />;

    default:
      return <Pages.UseState />;
  }
};

function App() {
  const [pageNumber, setPage] = useState(9);

  return (
    <div>
      <h1>React Tutorials</h1>
      <div>
        <button
          onClick={() => {
            setPage(1);
          }}
        >
          UseState
        </button>
        <button
          onClick={() => {
            setPage(2);
          }}
        >
          UseReducer
        </button>
        <button
          onClick={() => {
            setPage(3);
          }}
        >
          UseEffect
        </button>
        <button
          onClick={() => {
            setPage(4);
          }}
        >
          UseRef
        </button>
        <button
          onClick={() => {
            setPage(5);
          }}
        >
          UseLayoutEffect
        </button>
        <button
          onClick={() => {
            setPage(6);
          }}
        >
          ImperativeHandle
        </button>
        <button
          onClick={() => {
            setPage(7);
          }}
        >
          UseContext
        </button>
        <button
          onClick={() => {
            setPage(8);
          }}
        >
          UseMemo
        </button>
        <button
          onClick={() => {
            setPage(9);
          }}
        >
          UseCallback
        </button>
      </div>
      <div>{renderPage(pageNumber)}</div>
    </div>
  );
}

export default App;
