import nProgress from "nprogress";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { toast } from "react-toastify";

export const useSignup = () => {
  const navigate = useNavigate();

  const signupPrincipal = (email: string, password: string) => {
    nProgress.start();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        nProgress.done();
        toast.success("You've sucessfully created your account");
        navigate("/");
      })
      .catch((error: AuthError) => {
        nProgress.done();
        toast.error(`(${error.code}) - ${error.message}`);
      });
  };

  return { signupPrincipal };
};
