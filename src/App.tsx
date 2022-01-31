// biblioteki
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import nProgress from "nprogress";
import { useSelector, useDispatch } from "react-redux";

// css
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";

// pages
import { Add } from "./pages/Add";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Classes } from "./pages/Classes";
import { Settings } from "./pages/Settings";
import { SingleClass } from "./pages/SingleClass";
import { Teachers } from "./pages/Teachers";
import { Students } from "./pages/Students";
import { SingleStudent } from "./pages/SingleStudent";
import { SingleTeacher } from "./pages/SingleTeacher";

// wrappers
import { LayoutWrapper } from "./components/wrappers/LayoutWrapper";
import { ProtectedRoute } from "./components/wrappers/ProtectedRoute";

// firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.config";

// custom hooks
import { useDocument } from "./hooks/useDocument";
import { useRealTimeCollection } from "./hooks/useRealTimeCollection";

// redux
import { RootState } from "./redux/store";
import { setPrincipalData, setPrincipalAuth, setSchoolData } from "./redux/principalSlice";
import { setUserType } from './redux/userTypeSlice'
import { setStudentAuth, setStudentData } from './redux/studentSlice'

// utils
import { CombinedPrincipalData, CombinedSchoolDataFromFirebase, SingleStudentDataFromFirebase, StudentsDataFromFirebase, userType } from "./utils/interfaces";

//loader
import { Loader } from "./loader/Loader";

function App() {
  // eslint-disable-next-line
  const { realTimeDocuments } = useRealTimeCollection();
  const { getDocument, document } = useDocument();
  const dispatch = useDispatch();
  
  // redux
  const principal = useSelector((state: RootState) => state.principal);
  const student = useSelector((state: RootState) => state.student);
  const userType = useSelector((state: RootState) => state.userType.userType)
  
  // states
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<string>('')
  const [type, setType] = useState<string>('')


  useEffect(() => {
    dispatch(setSchoolData(realTimeDocuments as CombinedSchoolDataFromFirebase))
    // eslint-disable-next-line
  }, [realTimeDocuments])

//sprawdzic nowego usera
  // sprawdza czy dyrektor czy uczen i zapisauje pobrane dane do reduxa
  useEffect(() => {
    if(type === 'principals') {
      dispatch(setPrincipalData(document as CombinedPrincipalData));
    } 
    if(type === 'students') {
      if(document) {
        for(const [key, value] of Object.entries(document as StudentsDataFromFirebase)) {
          if(key === student.user?.email) {
            dispatch(setStudentData(value as SingleStudentDataFromFirebase))
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [document, domain, type]);

  useEffect(() => {
    if(student.data) {
      setLoading(false);
      nProgress.done();
    }
  }, [student.data])

  useEffect(() => {
    if(principal.data && principal.schoolData) {
      setLoading(false);
      nProgress.done();
    }
  }, [principal.data, principal.schoolData])


  // wyświetla aktualny stan store
  useEffect(() => {
    if(userType === 'principals') {
      console.log(principal);
    }
  }, [principal, userType]);

  useEffect(() => {
    if(userType === 'students') {
      console.log(student);
    }
  }, [student, userType]);
  ///

  // sprawdzanie czy uzytkownik juz jest zapisany w store 
  useEffect(() => {
    if ((principal.user && principal.data && principal.schoolData && userType) || (student.data && student.user && userType)) {
      setLoading(false);
      nProgress.done();
    }
  }, [principal.data, userType, principal.schoolData, principal.user, student.user, student.data]);

  // sprawdzanie stanu auth,  
  useEffect(() => {
    setLoading(true);
    nProgress.start();
    if ((principal.user && principal.data && principal.schoolData && userType) || (student.data && student.user && userType)) {
      setLoading(false);
      nProgress.done();
    } else {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          //odczytuje typ uzytkownika z displayName
          setDomain(user.displayName?.split("~")[0] as string)
          setType(user.displayName?.split("~")[1] as string)
          const _domain = user.displayName?.split("~")[0]
          const _type = user.displayName?.split("~")[1]
          dispatch(setUserType(_type as userType))
          if(_type === 'principals') {
            //zapisuje uzytkownika z auth
            dispatch(setPrincipalAuth(user));
            //pobieram z bazy danych informacje o uzytkowniku i kolekcję szkoły
            await getDocument("principals", user.uid);
          } else if (_type === 'students') {
            //zapisuje uzytkownika z auth
            dispatch(setStudentAuth(user))
            //pobieram z bazy danych informacje o uczniu
            await getDocument(_domain as string, 'students');
          }
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
      <div>
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
                path="/settings/:type"
                element={
                  <ProtectedRoute loading={loading}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes"
                element={
                  <ProtectedRoute loading={loading}>
                    <Classes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teachers"
                element={
                  <ProtectedRoute loading={loading}>
                    <Teachers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teachers/:email"
                element={
                  <ProtectedRoute loading={loading}>
                    <SingleTeacher />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute loading={loading}>
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:email"
                element={
                  <ProtectedRoute loading={loading}>
                    <SingleStudent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/class/:id/:subpage"
                element={
                  <ProtectedRoute loading={loading}>
                    <SingleClass />
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
              <Route path="/login" element={<Login loading={loading} />} />
              <Route path="/signup" element={<Signup loading={loading} />} />
            </Routes>
          </LayoutWrapper>
        </BrowserRouter>
        <ToastContainer
          position="bottom-left"
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
