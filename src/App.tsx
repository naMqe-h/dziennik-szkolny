import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Add } from "./pages/Add";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";
import { LayoutWrapper } from "./components/wrappers/LayoutWrapper";
import { ProtectedRoute } from "./components/wrappers/ProtectedRoute";
import { onAuthStateChanged } from "firebase/auth";
import nProgress from "nprogress";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "./firebase/firebase.config";
import { useDocument } from "./hooks/useDocument";
import { useRealTimeCollection } from "./hooks/useRealTimeCollection";
import { RootState } from "./redux/store";
import { setUserData, setUserType, setUserAuth } from "./redux/userSlice";
import { CombinedPrincipalData, userType } from "./utils/interfaces";
import { Loader } from "./loader/Loader";

function App() {
  const {} = useRealTimeCollection();
  const { getDocument, document } = useDocument();
  const [loading, setLoading] = useState(true);
  const state = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  //zapisauje pobrane dane o zalogowanym uzytkowniku
  useEffect(() => {
    if (document) {
      dispatch(setUserData(document as CombinedPrincipalData));
    }
  }, [document, dispatch]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  useEffect(() => {
    if (state.data && state.schoolData && state.user && state.userType) {
      setLoading(false);
      nProgress.done();
    }
  }, [state.data, state.userType, state.schoolData, state.user]);

  useEffect(() => {
    setLoading(true);
    nProgress.start();
    if (state.data && state.schoolData && state.user && state.userType) {
      setLoading(false);
      nProgress.done();
    } else {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          //odczytuje domene i typ uzytkownika z displayName
          const domain = user.displayName?.split("~")[0];
          const type = user.displayName?.split("~")[1];
          //zapisuje uzytkownika z auth
          dispatch(setUserType(type as userType));
          dispatch(setUserAuth(user));
          //pobieram z bazy danych informacje o uzytkowniku i kolekcję szkoły
          await getDocument("principals", user.uid);
          // getCollectionSub(domain as string);

          nProgress.done();
        } else {
          setLoading(false);
          nProgress.done();
        }
      });
      unsub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="">
        <BrowserRouter>
          <LayoutWrapper>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute loading={loading}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/:type"
                element={
                  <ProtectedRoute loading={loading}>
                    <Add />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute loading={loading}>
                    <p>Profile</p>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute loading={loading}>
                    <p>Settings</p>
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute loading={loading}>
                    <Navigate to="/" />
                  </ProtectedRoute>
                }
              />
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
}

export default App;
