import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { RootState } from "../../redux/store";
import { useDocument } from "../../hooks/useDocument";
import { setUserAuth, setUserData, setUserType } from "../../redux/userSlice";
import { CombinedPrincipalData } from "../../utils/interfaces";
import { onAuthStateChanged } from "firebase/auth";
import nProgress from "nprogress";
import { Loader } from "../../loader/Loader";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { getDocument, document } = useDocument();
  const [loading, setLoading] = useState(true);
  const state = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (document) {
      dispatch(setUserData(document as CombinedPrincipalData));
    }
  }, [document, dispatch]);

  useEffect(() => {
    setLoading(true);
    nProgress.start();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUserType("principals"));
        dispatch(setUserAuth(user));
        await getDocument("principals", user.uid);
        setLoading(false);
        nProgress.done();
      } else {
        setLoading(false);
        nProgress.done();
      }
    });
    unsub();
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
