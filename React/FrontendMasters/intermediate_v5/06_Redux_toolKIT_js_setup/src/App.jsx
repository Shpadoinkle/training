import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Details from "./Details";
import SearchParams from "./SearchParams";
import store from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const App = () => {
  // const adoptedPet = useState(null);
  return (
    // Must be first component
    <Provider store={store}>
      <BrowserRouter>
        {/* <AdoptedPetContext.Provider value={adoptedPet}> */}
        <QueryClientProvider client={queryClient}>
          <header>
            <Link to="/">Adopt Me!</Link>
          </header>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
            <Route path="/" element={<SearchParams />} />
          </Routes>
        </QueryClientProvider>
        {/* </AdoptedPetContext.Provider> */}
      </BrowserRouter>
    </Provider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
