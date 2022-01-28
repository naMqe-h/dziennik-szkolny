import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { useDocument } from "./useDocument";
import { CombinedPrincipalData, userType, StudentsDataFromFirebase } from "../utils/interfaces";
import { useDispatch } from "react-redux";
import { setPrincipalData, setUserAuth } from "../redux/principalSlice";
import { showToastError } from "../utils/utils";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getDocument, document } = useDocument();
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')

  const checkEmail = (value : StudentsDataFromFirebase | number) => {
    // return value. = email
    console.log(value, email)
  }

  useEffect(() => {
    if (document) {
      if(role === 'principals') {
        dispatch(setPrincipalData(document as CombinedPrincipalData));
      } else {
        checkEmail(5)
      }
      toast.success("Udało ci się zalogować 😎");
      navigate("/");
    }
    // eslint-disable-next-line
  }, [document, dispatch, navigate]);

  const login = async (email: string, password: string, role: userType) => {
    setRole(role)
    setEmail(email)
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch(setUserAuth(res.user));
        const domain = email.split('@')
        if(role === 'principals') { //logowanie dla dyrektora
          getDocument(role, res.user.uid);
        } else { //logowanie dla ucznia
          getDocument(domain[1], 'students');
        }
      })
      .catch((err: AuthError) => {
        showToastError(err);
      });
  };

  return { login };
};
