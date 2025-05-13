import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import GlobalProvider from "./GlobalProvider/GlobalProvider";
import { router } from "./Router/Router";
import "./styles/demo/Demos.scss";
import "./styles/layout/layout.scss";

function App() {
  return (
    <div>
      <PrimeReactProvider>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
