import nProgress from "nprogress";
import {
  createUserWithEmailAndPassword,
  AuthError,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { SetLoadingContext, showToastError } from "../utils/utils";
import { useSetDocument } from "./useSetDocument";
import {
  CombinedPrincipalData,
  CombinedSchoolInformationFromFirebase,
} from "../utils/interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDocument } from "./useDocument";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPrincipalAuth } from "../redux/principalSlice";

export const useSignup = () => {
  const { getDocument, document } = useDocument()
  const dispatch = useDispatch()
  const setLoading = useContext(SetLoadingContext);
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
    setLoading&&setLoading(true);
    nProgress.start();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        updateProfile(res.user, {
          displayName: `${data.schoolInformation.domain}~principals`,
        }).then((_res) => {
          dispatch(setPrincipalAuth(res.user))
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
