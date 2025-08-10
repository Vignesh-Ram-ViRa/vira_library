
import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home";
import About from "../screens/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

export default router;
