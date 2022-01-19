import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Navbar } from "./components/Navbar";
import { Add } from "./pages/Add";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { LayoutWrapper } from "./components/wrappers/LayoutWrapper";

function App() {
  const state = useSelector((state: RootState) => state.user);
  console.log(state);

  return (
    <div className="">
      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add/:type" element={<Add />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
