import nProgress from "nprogress";
import {
  createUserWithEmailAndPassword,
  AuthError,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { showToastError } from "../utils/utils";
import { useAddDocument } from "./useAddDocument";
import {
  CombinedPrincipalData,
  CombinedSchoolInformationFromFirebase,
} from "../utils/interfaces";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const { addDocument } = useAddDocument();
  const navigate = useNavigate();
  const signupPrincipal = async (
    email: string,
    password: string,
    data: CombinedPrincipalData,
    schoolData: CombinedSchoolInformationFromFirebase
  ) => {
    nProgress.start();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        updateProfile(res.user, {
          displayName: data.schoolInformation.domain,
        }).then(() => {
          addDocument("principals", res.user.uid, data);
          addDocument(data.schoolInformation.domain, "information", schoolData);
          navigate("/");
          nProgress.done();
        });
      })
      .catch((error: AuthError) => {
        showToastError(error);
        nProgress.done();
      });
  };

  return { signupPrincipal };
};
