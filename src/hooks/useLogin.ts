import { useEffect } from "react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { useDocument } from "./useDocument";
import { CombinedPrincipalData, userType } from "../utils/interfaces";
import { useDispatch } from "react-redux";
import { setUserAuth, setUserData } from "../redux/userSlice";
import { showToastError } from "../utils/utils";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getDocument, document } = useDocument();

  useEffect(() => {
    if (document) {
      dispatch(setUserData(document as CombinedPrincipalData));
      toast.success("Udało ci się zalogować 😎");
      navigate("/");
    }
  }, [document, dispatch, navigate]);

  const login = async (email: string, password: string, role: userType) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch(setUserAuth(res.user));
        getDocument(role, res.user.uid);
      })
      .catch((err: AuthError) => {
        showToastError(err);
      });
  };

  return { login };
};
