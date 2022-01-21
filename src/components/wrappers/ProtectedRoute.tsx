import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { RootState } from "../../redux/store";
import { useDocument } from "../../hooks/useDocument";
import { setUserAuth, setUserData, setUserType, setSchoolData } from "../../redux/userSlice";
import { CombinedPrincipalData, userType, CombinedSchoolDataFromFirebase } from "../../utils/interfaces";
import { onAuthStateChanged } from "firebase/auth";
import nProgress from "nprogress";
import { Loader } from "../../loader/Loader";
import { useCollection } from "../../hooks/useCollection";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { getCollection, documents } = useCollection()
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
  
  //zapisauje pobrane dane o odpowiedniej szkole
  useEffect(() => {
    if(documents){
      dispatch(setSchoolData(documents as CombinedSchoolDataFromFirebase))
    }
  }, [documents, dispatch])

  useEffect(() => {
    console.log(state)
  }, [state])

  useEffect(() => {
    setLoading(true);
    nProgress.start();
    if(state.data && state.schoolData && state.user && state.userType) {
      setLoading(false);
      nProgress.done();
    } else {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          //odczytuje domene i typ uzytkownika z displayName
          const domain = user.displayName?.split('~')[0]
          const type = user.displayName?.split('~')[1]
          //zapisuje uzytkownika z auth
          dispatch(setUserType(type as userType));
          dispatch(setUserAuth(user));
          //pobieram z bazy danych informacje o uzytkowniku i kolekcję szkoły
          await getDocument("principals", user.uid);
          await getCollection(domain as string)
          setLoading(false);
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
    if (state.data) {
      return children;
    }
    return <Navigate to="/login" />;
  }
};
