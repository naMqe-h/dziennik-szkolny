import nProgress from "nprogress";
import {
  createUserWithEmailAndPassword,
  AuthError,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { showToastError } from "../utils/utils";
import { useSetDocument } from "./useSetDocument";
import {
  CombinedPrincipalData,
  CombinedSchoolInformationFromFirebase,
} from "../utils/interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDocument } from "./useDocument";
import { useEffect } from "react";

export const useSignup = () => {
  const { getDocument, document } = useDocument()

  useEffect(() => {
    getDocument('utils', 'domains')
    // eslint-disable-next-line
  }, [])

  const { setDocument } = useSetDocument();
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
          displayName: `${data.schoolInformation.domain}~principals`,
        }).then(() => {
          schoolData.principalUID = res.user.uid;
          setDocument("principals", res.user.uid, data);
          setDocument(data.schoolInformation.domain, "information", schoolData);
          setDocument(data.schoolInformation.domain, "events", {
            classes:[],
            global:[]
          });
          setDocument('utils', 'domains', { names: [ ...document?.names, data.schoolInformation.domain ] });
          toast.success("Udało ci się utworzyć konto 😎");
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
