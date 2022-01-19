import nProgress from "nprogress";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { showToastError } from "../utils/utils";
import { useAddDocument } from "./useAddDocument";
import { CombinedPrincipalData } from "../utils/interfaces";

export const useSignup = () => {
  const { addDocument } = useAddDocument();

  const signupPrincipal = async (
    email: string,
    password: string,
    data: CombinedPrincipalData
  ) => {
    nProgress.start();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        addDocument("principals", res.user.uid, data);
      })
      .catch((error: AuthError) => {
        showToastError(error);
      });
  };

  return { signupPrincipal };
};
