import nProgress from "nprogress";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { showToastError } from "../utils/utils";
import { useAddDocument } from "./useAddDocument";
import { CombinedPrincipalData } from "../utils/interfaces";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const { addDocument } = useAddDocument();
  const navigate = useNavigate();

  const signupPrincipal = async (
    email: string,
    password: string,
    data: CombinedPrincipalData
  ) => {
    nProgress.start();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        //dodac displayName
        addDocument("principals", res.user.uid, data);
        navigate("/");
        nProgress.done();
      })
      .catch((error: AuthError) => {
        showToastError(error);
        nProgress.done();
      });
  };

  return { signupPrincipal };
};
