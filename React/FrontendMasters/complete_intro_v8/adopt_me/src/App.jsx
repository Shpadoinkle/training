// import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Details from "./Details";
import SearchParams from "./SearchParams";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Could use multiple clients if need different caches.. no real reason to do this though
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long to keep cache
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <header>
          <Link to="/">Adopt Me!</Link>
        </header>
        <Routes>
          <Route path="/details/:id" element={<Details />} />
          <Route path="/" element={<SearchParams />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
// root.render(React.createElement(App));
root.render(<App />);

// const App = () => {
//   return React.createElement("div", { id: "id-tag-for-html-element" }, [
//     React.createElement("h1", {}, "Adopt Me"),
//     React.createElement(Pet, {
//       animal: "Dog",
//       name: "Luna",
//       breed: "Pug",
//     }),
//     React.createElement(Pet, {
//       animal: "Bird",
//       name: "Pepper",
//       breed: "Cockatiel",
//     }),
//     React.createElement(Pet, {
//       animal: "Cat",
//       name: "Doink",
//       breed: "Mixed",
//     }),
//   ]);
// };