import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, AuthError, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { CombinedSchoolDataFromFirebase, SingleTeacherData } from "../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setTeacherData, setTeacherAuth } from '../redux/teacherSlice'
import { showToastError } from "../utils/utils";
import { useCollection } from "./useCollection";
import { setUserType } from "../redux/userTypeSlice";
import { useSetDocument } from "./useSetDocument";
import { RootState } from "../redux/store";

export const useTeacherLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const teacher = useSelector((state: RootState) => state.teacher)
  const [school, setSchool] = useState<CombinedSchoolDataFromFirebase>()
  const [email, setEmail] =  useState<string>('')
  const [password, setPassword] =  useState<string>('')
  const [domain, setDomain] = useState<string>('')
  const { getCollection, documents } = useCollection()
  const { setDocument } = useSetDocument()

  useEffect(() => {
      setSchool(documents as CombinedSchoolDataFromFirebase)
  }, [documents])

  useEffect(() => {
    if(teacher.data && teacher.user) {
        // toast.success("Udało ci się zalogować 😎")
        navigate("/")
    }
    // eslint-disable-next-line
  }, [teacher.data, teacher.user])

    useEffect(() => {
      //sprawdzanie danych
        if(school?.teachers) {
            let tempError = true
            for(const [key, value] of Object.entries(school?.teachers)) {
                if(key === email) {
                    if(value.password === '1') {
                        tempError = false
                        signInWithEmailAndPassword(auth, email, password).then((res) => {
                            dispatch(setUserType('teachers'))
                            dispatch(setTeacherAuth(res.user));
                            dispatch(setTeacherData(value as SingleTeacherData))
                        }).catch((err: AuthError) => {
                            showToastError(err)
                        })
                    } else if(value.password === password) {
                        tempError = false
                        createUserWithEmailAndPassword(auth, email, password).then((res) => {
                            updateProfile(res.user, {
                                displayName: `${domain}~teachers`,
                            }).then(() => {
                                //jesli nauczyciel się juz zalogował to ustawiamy w firestore jego hasło na '1' żeby nie przechowywac tam hasła
                                const data = {[email] : { password: '1' }}
                                setDocument(domain, 'teachers', data)
                                dispatch(setUserType('teachers'))
                                dispatch(setTeacherAuth(res.user))
                                dispatch(setTeacherData(value as SingleTeacherData))
                            })
                        })
                    } else {
                        toast.error("Podane hasło jest niepoprawne", { autoClose: 3000 })
                    }
                }
            }
            if(tempError) toast.error("Nie ma nauczyciela o takim adresie email", { autoClose: 3000 })
        }
      // eslint-disable-next-line
    }, [school])

  const teacherLogin = async (_email: string, _password: string) => {
        const _domain = _email.split('@')[1]
        setDomain(_email.split('@')[1])
        setEmail(_email)
        setPassword(_password)
        await getCollection(_domain)

  };

  return { teacherLogin };
};
