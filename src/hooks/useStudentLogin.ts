import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  AuthError,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import {
  CombinedSchoolDataFromFirebase,
  SingleStudentDataFromFirebase,
} from "../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setStudentData, setStudentAuth } from "../redux/studentSlice";
import { showToastError } from "../utils/utils";
import { useCollection } from "./useCollection";
import { setUserType } from "../redux/userTypeSlice";
import { useSetDocument } from "./useSetDocument";
import { RootState } from "../redux/store";

export const useStudentLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector((state: RootState) => state.student);
  const [school, setSchool] = useState<CombinedSchoolDataFromFirebase>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const { getCollection, documents } = useCollection();
  const { setDocument } = useSetDocument();

  useEffect(() => {
    setSchool(documents as CombinedSchoolDataFromFirebase);
  }, [documents]);

  useEffect(() => {
    if (student.data && student.user) {
      // toast.success("Udało ci się zalogować 😎")
      navigate("/");
    }
    // eslint-disable-next-line
  }, [student.data, student.user]);

  useEffect(() => {
    //sprawdzanie danych
    if (school?.students) {
      let tempError = true;
      for (const [key, value] of Object.entries(school?.students)) {
        if (key === email) {
          if (!value.isActive) {
            tempError = false;
            toast.error("Twoje konto jest nieaktywne");
          } else {
            if (value.password === "1") {
              tempError = false;
              signInWithEmailAndPassword(auth, email, password)
                .then((res) => {
                  dispatch(setUserType("students"));
                  dispatch(setStudentAuth(res.user));
                  dispatch(
                    setStudentData(value as SingleStudentDataFromFirebase)
                  );
                })
                .catch((err: AuthError) => {
                  showToastError(err);
                });
            } else if (value.password === password) {
              tempError = false;
              createUserWithEmailAndPassword(auth, email, password).then(
                (res) => {
                  updateProfile(res.user, {
                    displayName: `${domain}~students`,
                  }).then(() => {
                    //jesli uczen się juz zalogował to ustawiamy w firestore jego hasło na '1' żeby nie przechowywac tam hasła
                    const data = { [email]: { password: "1" } };
                    setDocument(domain, "students", data);
                    dispatch(setUserType("students"));
                    dispatch(setStudentAuth(res.user));
                    dispatch(
                      setStudentData(value as SingleStudentDataFromFirebase)
                    );
                  });
                }
              );
            } else {
              toast.error("Podane hasło jest niepoprawne", { autoClose: 3000 });
            }
          }
        }
      }
      if (tempError)
        toast.error("Nie ma ucznia o takim adresie email", { autoClose: 3000 });
    }
    // eslint-disable-next-line
  }, [school]);

  const studentLogin = async (_email: string, _password: string) => {
    const _domain = _email.split("@")[1];
    setDomain(_email.split("@")[1]);
    setEmail(_email);
    setPassword(_password);
    await getCollection(_domain);
  };

  return { studentLogin };
};
