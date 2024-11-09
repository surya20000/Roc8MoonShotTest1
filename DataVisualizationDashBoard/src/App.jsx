import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Chart from "./pages/Chart";
import PrivateRoutes from "./utils/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<SignIn />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/chart" element={<Chart />} />
      </Route>
    </Routes>
  );
}

export default App;
