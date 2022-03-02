// biblioteki
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { LessonPlan as LessonPlanView } from "./pages/LessonPlan";
import { Profile } from "./components/profile/Profile";
import { Presence } from "./pages/Presence";

// wrappers
import { LayoutWrapper } from "./components/wrappers/LayoutWrapper";
import { PrincipalRoute } from "./components/wrappers/PrincipalRoute";
import { TeacherRoute } from "./components/wrappers/TeacherRoute";
import { StudentRoute } from "./components/wrappers/StudentRoute";

// firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.config";

// custom hooks
import { useDocument } from "./hooks/useDocument";
import { useRealTimeCollection } from "./hooks/useRealTimeCollection";

// redux
import { RootState } from "./redux/store";
import { setPrincipalData, setPrincipalAuth } from "./redux/principalSlice";
import { setUserType } from "./redux/userTypeSlice";
import { setStudentAuth, setStudentData } from "./redux/studentSlice";
import { setTeacherAuth, setTeacherData } from "./redux/teacherSlice";
import { setSchoolData } from "./redux/schoolDataSlice";

// utils
import {
  CombinedPrincipalData,
  CombinedSchoolDataFromFirebase,
  SingleStudentDataFromFirebase,
  SingleTeacherData,
  StudentsDataFromFirebase,
  TeachersDataFromFirebase,
  userType,
} from "./utils/interfaces";

//loader
import { Loader } from "./loader/Loader";

//do uporządkowania
import { Generate } from "./components/principal/lessonPlan/Generate";
import { StudentGradesView } from "./components/student/grades/StudentGradesView";
import { useRealTimePrincipal } from "./hooks/useRealTimePrincipal";
import { Frequency } from "./pages/Frequency";
import { Messages } from "./pages/Messages";
import { NotFound } from "./pages/404";
import { SetLoadingContext } from "./utils/utils";

function App() {
  const { realTimeDocuments } = useRealTimeCollection();
  const { realTimePrincipal } = useRealTimePrincipal();
  const { getDocument, document } = useDocument();
  const dispatch = useDispatch();
  const currAuth = auth.currentUser;
  // redux
  const principal = useSelector((state: RootState) => state.principal);
  const student = useSelector((state: RootState) => state.student);
  const teacher = useSelector((state: RootState) => state.teacher);
  const schoolData = useSelector(
    (state: RootState) => state.schoolData.schoolData
  );
  const userType = useSelector((state: RootState) => state.userType.userType);

  // states
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    dispatch(
      setSchoolData(realTimeDocuments as CombinedSchoolDataFromFirebase)
    );
    // eslint-disable-next-line
  }, [realTimeDocuments]);

  useEffect(() => {
    dispatch(setPrincipalData(realTimePrincipal as CombinedPrincipalData));
    // eslint-disable-next-line
  }, [realTimePrincipal]);

  //sprawdzic nowego usera
  // sprawdza czy dyrektor czy uczen czy nauczyciel i zapisauje pobrane dane do reduxa
  useEffect(() => {
    if (type === "students") {
      if (document) {
        for (const [key, value] of Object.entries(
          document as StudentsDataFromFirebase
        )) {
          if (key === student.user?.email) {
            dispatch(setStudentData(value as SingleStudentDataFromFirebase));
          }
        }
      }
    }
    if (type === "teachers") {
      if (document) {
        for (const [key, value] of Object.entries(
          document as TeachersDataFromFirebase
        )) {
          if (key === teacher.user?.email) {
            dispatch(setTeacherData(value as SingleTeacherData));
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [document, domain, type]);

  // sprawdzanie czy juz cały user się zapisał i wtedy kończy ładowanie
  useEffect(() => {
    if (
      (principal.data && schoolData) ||
      (teacher.data && schoolData) ||
      student.data
    ) {
      setLoading(false);
      nProgress.done();
    }
  }, [principal.data, schoolData, teacher.data, student.data,currAuth]);

  // wyświetla aktualny stan store
  useEffect(() => {
    if (userType === "principals") {
      console.log(principal);
      console.log(schoolData);
    }
  }, [principal, userType, schoolData]);

  useEffect(() => {
    if (userType === "teachers") {
      console.log(teacher);
      console.log(schoolData);
    }
  }, [teacher, userType, schoolData]);

  useEffect(() => {
    if (userType === "students") {
      console.log(student);
      console.log(schoolData);
    }
  }, [student, userType, schoolData]);
  ///
  // sprawdzanie stanu auth,
  useEffect(() => {
    setLoading(true);
    nProgress.start();
    if (
      (principal.user && principal.data && schoolData && userType) ||
      (student.data && student.user && userType) ||
      (teacher.data && userType && schoolData)
    ) {
      setLoading(false);
      nProgress.done();
    } else {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          //odczytuje typ uzytkownika z displayName
          setDomain(user.displayName?.split("~")[0] as string);
          setType(user.displayName?.split("~")[1] as string);
          const _domain = user.displayName?.split("~")[0];
          const _type = user.displayName?.split("~")[1];
          dispatch(setUserType(_type as userType));
          if (_type === "principals") {
            //zapisuje uzytkownika z auth
            dispatch(setPrincipalAuth(user));
          } else if (_type === "students") {
            //zapisuje uzytkownika z auth
            dispatch(setStudentAuth(user));
            //pobieram z bazy danych informacje o uczniach
            await getDocument(_domain as string, "students");
          } else if (_type === "teachers") {
            //zapisuje uzytkownika z auth
            dispatch(setTeacherAuth(user));
            //pobieram z bazy danych informacje o nauczycielach
            await getDocument(_domain as string, "teachers");
          }
        } else {
          setLoading(false);
          nProgress.done();
        }
      });
      unsub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal.user,student.user,teacher.user]);
  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
      <SetLoadingContext.Provider value={setLoading}>
        <BrowserRouter>
          <LayoutWrapper>
            <Routes>
              <Route
                path="/"
                element={
                  <StudentRoute loading={loading}>
                    <Dashboard />
                  </StudentRoute>
                }
              />
              <Route
                path="/add/:type"
                element={
                  <PrincipalRoute loading={loading}>
                    <Add />
                  </PrincipalRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <StudentRoute loading={loading}>
                    <Profile />
                  </StudentRoute>
                }
              />
              <Route
                path="/settings/:type"
                element={
                  <StudentRoute loading={loading}>
                    <Settings />
                  </StudentRoute>
                }
              />
              <Route
                path="/classes"
                element={
                  <TeacherRoute loading={loading}>
                    <Classes />
                  </TeacherRoute>
                }
              />
              <Route
                path="/teachers"
                element={
                  <PrincipalRoute loading={loading}>
                    <Teachers />
                  </PrincipalRoute>
                }
              />
              <Route
                path="/teachers/:email"
                element={
                  <PrincipalRoute loading={loading}>
                    <SingleTeacher />
                  </PrincipalRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <PrincipalRoute loading={loading}>
                    <Students />
                  </PrincipalRoute>
                }
              />
              <Route
                path="/students/:email"
                element={
                  <PrincipalRoute loading={loading}>
                    <SingleStudent />
                  </PrincipalRoute>
                }
              />
              <Route
                path="/class/:id/:subpage"
                element={
                  <TeacherRoute loading={loading}>
                    <SingleClass />
                  </TeacherRoute>
                }
              />
              <Route
                path="/lesson-plan/generate"
                element={
                  <PrincipalRoute loading={loading}>
                    <Generate />
                  </PrincipalRoute>
                }
              />
              <Route
                path="/lesson-plan"
                element={
                  <StudentRoute loading={loading}>
                    <LessonPlanView />
                  </StudentRoute>
                }
              />
              <Route
                path="/presence"
                element={
                  <TeacherRoute loading={loading}>
                    <Presence />
                  </TeacherRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <StudentRoute loading={loading}>
                    <Messages />
                  </StudentRoute>
                }
              />
              <Route
                path="/grades"
                element={
                  <StudentRoute loading={loading}>
                    <StudentGradesView />
                  </StudentRoute>
                }
              />
              <Route
                path="/frequency"
                element={
                  <StudentRoute loading={loading}>
                    <Frequency />
                  </StudentRoute>
                }
              />
              <Route
                path="*"
                element={
                  <StudentRoute loading={loading}>
                    {/* <Navigate to="/" /> */}
                    <NotFound />
                  </StudentRoute>
                }
              />
              <Route path="/login" element={<Login loading={loading} />} />
              <Route path="/signup" element={<Signup loading={loading}  />} />
            </Routes>
          </LayoutWrapper>
        </BrowserRouter>
              </SetLoadingContext.Provider>
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
